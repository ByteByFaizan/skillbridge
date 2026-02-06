import type {
  CareerPath,
  SkillGapAnalysis,
  JobOpportunity,
  CareerGrowthStep,
} from "./career";
import type { RoadmapStep } from "./roadmap";

export interface ParsedCareerResponse {
  careerOverview: CareerPath[];
  skillGapAnalysis: SkillGapAnalysis[];
  learningRoadmap: {
    duration_months: number;
    steps: RoadmapStep[];
  };
  jobRolesAndOpportunities: JobOpportunity[];
  careerGrowthPath: CareerGrowthStep[];
  personalizedAdvice: string[];
}
