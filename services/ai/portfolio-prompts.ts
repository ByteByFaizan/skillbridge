import type { SkillGapItem, CareerOverviewItem } from "./portfolio-types";

/* ═══════════════════════════════════════════════════════
   PORTFOLIO PROJECT GENERATOR — Prompt Templates
   ═══════════════════════════════════════════════════════ */

export const PORTFOLIO_SYSTEM_PROMPT = `You are an expert Portfolio Project Architect and Technical Mentor.

Your role is to generate practical, portfolio-ready project ideas that:
- Force the student to practice the exact skills they are missing
- Are framed around real-world business value
- Would genuinely impress hiring managers
- Are achievable within the specified time scope

You must think like:
- A senior engineer reviewing a junior developer's portfolio
- A hiring manager scanning GitHub repositories
- A mentor designing learning-by-doing exercises

Your tone must be:
- Professional and encouraging
- Practical and specific
- Industry-aware

Avoid:
- Generic projects (To-Do apps, calculators, weather apps)
- Overly ambitious unrealistic scope
- Vague descriptions that don't teach anything`;

export const PORTFOLIO_DEVELOPER_PROMPT = `IMPORTANT OUTPUT RULES (STRICT):

1. You MUST respond with ONLY valid JSON. No markdown, no code fences, no extra text.
2. The JSON MUST be an object with a single key "projects" containing an array of exactly 3 project objects.
3. Do NOT include emojis anywhere in the output.
4. Each project must directly address the student's missing skills.
5. Feature checklists must have 5-8 specific, actionable items.
6. Estimated time must match the requested scope.

The JSON output MUST conform to the following schema exactly:

{
  "projects": [
    {
      "title": "string — creative, professional project name (not generic)",
      "description": "string — 2-3 sentences explaining what the project does and its real-world value",
      "estimatedTime": "string — e.g. '1 Weekend', '1-2 Weeks', '4-6 Weeks'",
      "coreSkill": "string — the primary skill this project practices",
      "featureChecklist": [
        "string — specific, actionable feature/task to implement (5-8 items)"
      ]
    }
  ]
}

SCOPE GUIDELINES:
- "weekend": Small, focused projects completable in 1-2 days. 5 checklist items.
- "sprint": Medium projects taking 1-2 weeks. 6-7 checklist items.
- "capstone": Large, impressive projects taking 4-8 weeks. 7-8 checklist items.

CRITICAL:
- Output ONLY the JSON object with "projects" key. No wrapping text, no explanation, no markdown.
- The root value must be a JSON object like {"projects": [...]}.`;

export interface PortfolioPromptInput {
  careerOverview: CareerOverviewItem[];
  skillGapAnalysis: SkillGapItem[];
  scope: "weekend" | "sprint" | "capstone";
}

export function buildPortfolioUserPrompt(input: PortfolioPromptInput): string {
  const scopeLabels: Record<string, string> = {
    weekend: "Weekend Hack (1-2 days)",
    sprint: "Sprint (1-2 weeks)",
    capstone: "Capstone (4-8 weeks)",
  };

  const missingSkills = input.skillGapAnalysis
    .flatMap((sg) => sg.missingSkills.map((s) => s.name))
    .filter((name, i, arr) => arr.indexOf(name) === i); // dedupe

  const existingSkills = input.skillGapAnalysis
    .flatMap((sg) => sg.existingSkills.map((s) => s.name))
    .filter((name, i, arr) => arr.indexOf(name) === i);

  const careerTargets = input.careerOverview
    .map((c) => c.title)
    .join(", ");

  const highPriority = input.skillGapAnalysis
    .flatMap((sg) => sg.missingSkills.filter((s) => s.priority === "High").map((s) => s.name))
    .filter((name, i, arr) => arr.indexOf(name) === i);

  const lines = [
    `Generate 3 portfolio-ready project ideas for this student:`,
    ``,
    `Scope: ${scopeLabels[input.scope] || input.scope}`,
    `Target Careers: ${careerTargets}`,
    `Skills They Already Have: ${existingSkills.join(", ")}`,
    `Skills They Need to Learn: ${missingSkills.join(", ")}`,
    `High-Priority Skills to Focus On: ${highPriority.join(", ") || "All equally important"}`,
    ``,
    `Requirements:`,
    `- Each project must force practice of at least 2-3 missing skills`,
    `- Projects should be different from each other (different domains/approaches)`,
    `- Feature checklists must be specific enough to serve as implementation guides`,
    `- Frame projects around real business value, not academic exercises`,
    `- Match the estimated time to the "${input.scope}" scope`,
    ``,
    `Generate the JSON array of 3 projects now.`,
  ];

  return lines.join("\n");
}

export function buildPortfolioRepairPrompt(
  rawOutput: string,
  errorMessage: string
): string {
  return `The previous response was not valid JSON or did not match the required schema.

Error: ${errorMessage}

Your previous output (truncated):
${rawOutput.slice(0, 2000)}

Please output ONLY a corrected JSON object with a "projects" key containing an array of exactly 3 project objects. Format: {"projects": [...]}. No markdown, no explanation, just the JSON object.`;
}
