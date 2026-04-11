/* ═══════════════════════════════════════════════════════
   Shared types for portfolio project generation
   ═══════════════════════════════════════════════════════ */

export interface CareerOverviewItem {
  title: string;
  why: string;
  demandLevel: "High" | "Medium" | "Low";
}

export interface SkillGapItem {
  careerTitle: string;
  existingSkills: { name: string }[];
  missingSkills: { name: string; priority: string }[];
}

export interface PortfolioProject {
  title: string;
  description: string;
  estimatedTime: string;
  coreSkill: string;
  featureChecklist: string[];
}
