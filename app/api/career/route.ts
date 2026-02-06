import { NextResponse } from "next/server";
import { chat } from "@/services/ai/openrouter";
import { SYSTEM_PROMPT, DEVELOPER_PROMPT, buildUserPrompt } from "@/services/ai/prompts";
import { parseCareerResponse } from "@/services/ai/formatter";
import { validateDiscoveryInput } from "@/utils/validators";
import { getErrorMessage } from "@/utils/errorHandler";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, education, skills = [], interests = [], goal } = body;

    const validation = validateDiscoveryInput({ education, skills, interests });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 }
      );
    }

    const userPrompt = buildUserPrompt({
      name,
      education: String(education).trim(),
      skills: Array.isArray(skills) ? skills.map(String) : [String(skills)],
      interests: Array.isArray(interests) ? interests.map(String) : [String(interests)],
      goal: goal ? String(goal).trim() : undefined,
    });

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      { role: "system" as const, content: DEVELOPER_PROMPT },
      { role: "user" as const, content: userPrompt },
    ];

    const rawResponse = await chat(messages);
    const parsed = parseCareerResponse(rawResponse);

    return NextResponse.json(parsed);
  } catch (err) {
    const message = getErrorMessage(err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
