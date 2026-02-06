import type { ParsedCareerResponse } from "@/types/ai-response";

export async function saveCareerRecommendation(
  _userId: string,
  _data: ParsedCareerResponse
): Promise<void> {
  // TODO: persist to Supabase when auth is enabled
}

export async function getLatestRecommendation(_userId: string) {
  return null;
}
