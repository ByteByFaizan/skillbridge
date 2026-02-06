"use server";

import { createServiceClient } from "@/lib/supabase";

export async function getOrCreateUserProfile(userId: string, userData?: {
  full_name?: string;
  education_level?: string;
  interests?: string[];
}) {
  try {
    const supabase = createServiceClient();

    // Check if profile exists
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (existing) {
      return existing;
    }

    // Create new profile
    const { data, error } = await supabase
      .from("users")
      .insert({
        id: userId,
        full_name: userData?.full_name || null,
        education_level: userData?.education_level || null,
        interests: userData?.interests || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error in getOrCreateUserProfile:", err);
    return null;
  }
}

export async function updateUserSkills(userId: string, skills: Array<{ skill_name: string; proficiency_level?: string }>) {
  try {
    const supabase = createServiceClient();

    // Delete existing skills
    await supabase
      .from("user_skills")
      .delete()
      .eq("user_id", userId);

    // Insert new skills
    const skillInserts = skills.map(skill => ({
      user_id: userId,
      skill_name: skill.skill_name,
      proficiency_level: skill.proficiency_level || "Beginner",
    }));

    const { error } = await supabase
      .from("user_skills")
      .insert(skillInserts);

    if (error) {
      console.error("Error updating skills:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in updateUserSkills:", err);
    return false;
  }
}
