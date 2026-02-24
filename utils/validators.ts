import { z } from "zod";

/* ═══════════════════════════════════════════════════════
   INPUT SCHEMA — Discovery form payload
   ═══════════════════════════════════════════════════════ */

export const CareerInputSchema = z.object({
  education: z.enum([
    "high-school",
    "undergraduate",
    "graduate",
    "postgraduate",
    "self-taught",
  ]),
  skills: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one skill is required")
    .max(30),
  interests: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one interest is required")
    .max(30),
  goal: z.string().max(300).optional().default(""),
  name: z.string().max(100).optional().default(""),
});

export type CareerInput = z.infer<typeof CareerInputSchema>;

/* ═══════════════════════════════════════════════════════
   OUTPUT SCHEMA — Strict AI response (CareerReport)
   ═══════════════════════════════════════════════════════ */

const PriorityEnum = z.enum(["High", "Medium", "Low"]);
const DemandLevelEnum = z.enum(["High", "Medium", "Low"]);

const CareerOverviewItemSchema = z.object({
  title: z.string().min(1),
  why: z.string().min(1),
  demandLevel: DemandLevelEnum,
});

const SkillGapItemSchema = z.object({
  careerTitle: z.string().min(1),
  existingSkills: z.array(z.object({ name: z.string().min(1) })),
  missingSkills: z.array(
    z.object({
      name: z.string().min(1),
      priority: PriorityEnum,
    })
  ),
});

const RoadmapMonthSchema = z.object({
  month: z.number().int().min(1).max(6),
  topics: z.array(z.string().min(1)).min(1),
  tools: z.array(z.string().min(1)).min(1),
  platforms: z.array(z.string().min(1)).min(1),
});

const LearningRoadmapSchema = z.object({
  durationMonths: z.literal(6),
  months: z
    .array(RoadmapMonthSchema)
    .length(6)
    .refine(
      (months) => {
        const nums = months.map((m) => m.month).sort();
        return (
          nums.length === 6 &&
          nums[0] === 1 &&
          nums[1] === 2 &&
          nums[2] === 3 &&
          nums[3] === 4 &&
          nums[4] === 5 &&
          nums[5] === 6
        );
      },
      { message: "Months must be exactly 1 through 6, each present once" }
    ),
});

const JobRolesSchema = z.object({
  entryLevelRoles: z.array(z.string().min(1)).min(1),
  internships: z.array(z.string().min(1)).min(1),
  freelanceOrProjectIdeas: z.array(z.string().min(1)).min(1),
});

const CareerGrowthStepSchema = z.object({
  yearRange: z.string().min(1),
  roleTitle: z.string().min(1),
  salaryRange: z.string().min(1),
  specializations: z.array(z.string()).optional().default([]),
});

const CareerGrowthPathItemSchema = z.object({
  careerTitle: z.string().min(1),
  steps: z.array(CareerGrowthStepSchema).min(1),
});

export const CareerReportSchema = z.object({
  careerOverview: z.array(CareerOverviewItemSchema).min(2).max(3),
  skillGapAnalysis: z.array(SkillGapItemSchema).min(2).max(3),
  learningRoadmap: LearningRoadmapSchema,
  jobRolesAndOpportunities: JobRolesSchema,
  careerGrowthPath: z.array(CareerGrowthPathItemSchema).min(2).max(3),
  personalizedAdvice: z.array(z.string().min(1)).min(3).max(5),
});

export type CareerReport = z.infer<typeof CareerReportSchema>;
