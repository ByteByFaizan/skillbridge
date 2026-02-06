"use server";

import type { ParsedCareerResponse } from "@/types/ai-response";
import { createServerSupabaseClient } from "@/lib/supabase";

// Database record types
interface SkillGapRecord {
  skill_name: string;
  gap_type: string;
  priority: string;
}

interface RoadmapStepRecord {
  month_number: number;
  topics: string[];
  tools: string[];
  resources: string[];
}

interface JobOpportunityRecord {
  role_type: string;
  title: string;
  description: string;
}

interface CareerGrowthPathRecord {
  year_range: string;
  role_title: string;
  salary_range: string | null;
}

interface PersonalizedAdviceRecord {
  advice: string;
}

export async function saveCareerRecommendation(
  userId: string,
  data: ParsedCareerResponse
): Promise<string | null> {
  try {
    // Use user session instead of service role to respect RLS
    const supabase = await createServerSupabaseClient();

    // Save each career recommendation
    const careerInserts = data.careerOverview.map(career => ({
      user_id: userId,
      career_title: career.title,
      reason: career.reason,
      demand_level: career.demand,
    }));

    const { data: careers, error: careerError } = await supabase
      .from("career_recommendations")
      .insert(careerInserts)
      .select();

    if (careerError || !careers) {
      console.error("Error saving careers:", careerError?.message || "Unknown database error");
      return null;
    }

    // Save skill gap analysis for each career
    for (let i = 0; i < careers.length; i++) {
      const career = careers[i];
      const analysis = data.skillGapAnalysis[i];
      
      if (analysis) {
        const skillGapInserts = [
          ...analysis.existingSkills.map(skill => ({
            career_id: career.id,
            skill_name: skill,
            gap_type: "Existing" as const,
            priority: "Medium" as const,
          })),
          ...analysis.missingSkills.map(skill => ({
            career_id: career.id,
            skill_name: skill.name,
            gap_type: "Missing" as const,
            priority: skill.priority,
          })),
        ];

        await supabase.from("skill_gap_analysis").insert(skillGapInserts);
      }

      // Save learning roadmap
      const { data: roadmap, error: roadmapError } = await supabase
        .from("learning_roadmaps")
        .insert({
          career_id: career.id,
          duration_months: data.learningRoadmap.duration_months,
        })
        .select()
        .single();

      if (!roadmapError && roadmap) {
        const roadmapSteps = data.learningRoadmap.steps.map(step => ({
          roadmap_id: roadmap.id,
          month_number: step.month_number,
          topics: step.topics,
          tools: step.tools,
          resources: step.resources,
        }));

        await supabase.from("roadmap_steps").insert(roadmapSteps);
      }

      // Save job opportunities
      const jobOpportunities = data.jobRolesAndOpportunities
        .filter((_, idx) => idx % data.careerOverview.length === i)
        .map(job => ({
          career_id: career.id,
          role_type: job.role_type,
          title: job.title,
          description: job.description,
        }));

      if (jobOpportunities.length > 0) {
        await supabase.from("job_opportunities").insert(jobOpportunities);
      }

      // Save career growth path
      const growthSteps = data.careerGrowthPath
        .filter((_, idx) => idx % data.careerOverview.length === i)
        .map(step => ({
          career_id: career.id,
          year_range: step.year_range,
          role_title: step.role_title,
          salary_range: step.salary_range || null,
        }));

      if (growthSteps.length > 0) {
        await supabase.from("career_growth_paths").insert(growthSteps);
      }
    }

    // Save personalized advice
    if (data.personalizedAdvice.length > 0) {
      const adviceInserts = data.personalizedAdvice.map(advice => ({
        user_id: userId,
        advice,
      }));

      await supabase.from("personalized_advice").insert(adviceInserts);
    }

    return careers[0].id;
  } catch (err) {
    console.error("Error in saveCareerRecommendation:", err instanceof Error ? err.message : "Unknown error");
    return null;
  }
}

export async function getLatestRecommendation(userId: string) {
  try {
    // Use user session instead of service role to respect RLS
    const supabase = await createServerSupabaseClient();

    const { data: careers, error } = await supabase
      .from("career_recommendations")
      .select(`
        *,
        skill_gap_analysis (*),
        learning_roadmaps (
          *,
          roadmap_steps (*)
        ),
        job_opportunities (*),
        career_growth_paths (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error || !careers) {
      console.error("Error fetching careers:", error?.message || "Unknown database error");
      return null;
    }

    const { data: advice } = await supabase
      .from("personalized_advice")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Transform database format back to ParsedCareerResponse format
    return {
      careerOverview: careers.map(c => ({
        title: c.career_title,
        reason: c.reason,
        demand: c.demand_level as "High" | "Medium" | "Low",
      })),
      skillGapAnalysis: careers.map(c => ({
        career_title: c.career_title,
        existing_skills: c.skill_gap_analysis
          ?.filter((s: SkillGapRecord) => s.gap_type === "Existing")
          .map((s: SkillGapRecord) => s.skill_name) || [],
        missing_skills: c.skill_gap_analysis
          ?.filter((s: SkillGapRecord) => s.gap_type === "Missing")
          .map((s: SkillGapRecord) => ({
            name: s.skill_name,
            priority: s.priority as "High" | "Medium" | "Low",
          })) || [],
      })),
      learningRoadmap: {
        duration_months: careers[0]?.learning_roadmaps?.[0]?.duration_months || 6,
        steps: careers[0]?.learning_roadmaps?.[0]?.roadmap_steps?.map((step: RoadmapStepRecord) => ({
          month: step.month_number,
          topics: step.topics,
          tools: step.tools,
          resources: step.resources,
        })) || [],
      },
      jobRolesAndOpportunities: careers.flatMap(c => 
        c.job_opportunities?.map((j: JobOpportunityRecord) => ({
          role_type: j.role_type,
          title: j.title,
          description: j.description,
        })) || []
      ),
      careerGrowthPath: careers.flatMap(c =>
        c.career_growth_paths?.map((g: CareerGrowthPathRecord) => ({
          year_range: g.year_range,
          role_title: g.role_title,
          salary_range: g.salary_range,
        })) || []
      ),
      personalizedAdvice: advice?.map((a: PersonalizedAdviceRecord) => a.advice) || [],
    };
  } catch (err) {
    console.error("Error in getLatestRecommendation:", err instanceof Error ? err.message : "Unknown error");
    return null;
  }
}

export async function getSavedCareers(userId: string) {
  try {
    // Use user session instead of service role to respect RLS
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("saved_careers")
      .select(`
        *,
        career:career_recommendations (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved careers:", error.message || "Unknown database error");
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error in getSavedCareers:", err instanceof Error ? err.message : "Unknown error");
    return [];
  }
}

export async function saveCareer(userId: string, careerId: string) {
  try {
    // Use user session instead of service role to respect RLS
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("saved_careers")
      .insert({
        user_id: userId,
        career_id: careerId,
      });

    if (error) {
      console.error("Error saving career:", error.message || "Unknown database error");
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in saveCareer:", err instanceof Error ? err.message : "Unknown error");
    return false;
  }
}
