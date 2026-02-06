export type DemandLevel = "High" | "Medium" | "Low";
export type SkillPriority = "High" | "Medium" | "Low";
export type GapType = "Existing" | "Missing";
export type RoleType = "Job" | "Internship" | "Freelance";

export interface CareerPath {
  title: string;
  reason: string;
  demand: DemandLevel;
}

export interface SkillGap {
  skill_name: string;
  gap_type: GapType;
  priority?: SkillPriority;
}

export interface SkillGapAnalysis {
  careerTitle: string;
  existingSkills: string[];
  missingSkills: Array<{ name: string; priority: SkillPriority }>;
}

export interface JobOpportunity {
  role_type: RoleType;
  title: string;
  description?: string;
  skill_focus?: string;
}

export interface CareerGrowthStep {
  year_range: string;
  role_title: string;
  salary_range?: string;
}
