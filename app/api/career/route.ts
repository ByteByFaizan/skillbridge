import { NextResponse } from "next/server";
import { chat } from "@/services/ai/openrouter";
import { SYSTEM_PROMPT, DEVELOPER_PROMPT, buildUserPrompt } from "@/services/ai/prompts";
import { parseCareerResponse } from "@/services/ai/formatter";
import { validateDiscoveryInput, sanitizeInput, sanitizeArray } from "@/utils/validators";
import { getErrorMessage } from "@/utils/errorHandler";
import { rateLimit } from "@/utils/rateLimit";
import { getUserFromRequest } from "@/lib/auth";
import { saveCareerRecommendation } from "@/services/database/career.service";
import { getOrCreateUserProfile, updateUserSkills } from "@/services/database/user.service";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // Rate limiting - 5 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = rateLimit(ip, { interval: 60000, maxRequests: 5 });
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            "X-RateLimit-Reset": String(rateLimitResult.reset),
          }
        }
      );
    }

    const body = await request.json();
    const { name, education, skills = [], interests = [], goal } = body;

    // Sanitize inputs
    const sanitizedEducation = sanitizeInput(String(education || ""));
    const sanitizedSkills = sanitizeArray(Array.isArray(skills) ? skills.map(String) : [String(skills)]);
    const sanitizedInterests = sanitizeArray(Array.isArray(interests) ? interests.map(String) : [String(interests)]);
    const sanitizedGoal = goal ? sanitizeInput(String(goal)) : undefined;
    const sanitizedName = name ? sanitizeInput(String(name)) : undefined;

    const validation = validateDiscoveryInput({ 
      education: sanitizedEducation, 
      skills: sanitizedSkills, 
      interests: sanitizedInterests 
    });
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 }
      );
    }

    // Generate AI response
    const userPrompt = buildUserPrompt({
      name: sanitizedName,
      education: sanitizedEducation,
      skills: sanitizedSkills,
      interests: sanitizedInterests,
      goal: sanitizedGoal,
    });

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      { role: "system" as const, content: DEVELOPER_PROMPT },
      { role: "user" as const, content: userPrompt },
    ];

    const rawResponse = await chat(messages);
    const parsed = parseCareerResponse(rawResponse);

    // Check if user is authenticated
    const user = await getUserFromRequest(request);

    if (user) {
      // Save to database if user is logged in
      try {
        await getOrCreateUserProfile(user.id, {
          full_name: sanitizedName,
          education_level: sanitizedEducation,
          interests: sanitizedInterests,
        });

        await updateUserSkills(user.id, sanitizedSkills.map(skill => ({
          skill_name: skill,
          proficiency_level: "Beginner",
        })));

        const savedId = await saveCareerRecommendation(user.id, parsed);

        return NextResponse.json({
          ...parsed,
          saved: true,
          career_id: savedId,
        });
      } catch (dbError) {
        console.error("Database save error:", dbError);
        // Return AI result even if database save fails
        return NextResponse.json({
          ...parsed,
          saved: false,
          warning: "Results generated but not saved to your account",
        });
      }
    }

    // Return result without saving if not authenticated
    return NextResponse.json({
      ...parsed,
      saved: false,
    });
  } catch (err) {
    const message = getErrorMessage(err);
    console.error("Career API Error:", message, err);
    return NextResponse.json(
      { error: message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
