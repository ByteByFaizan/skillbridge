import type { ParsedCareerResponse } from "@/types/ai-response";
import type { CareerPath, SkillGapAnalysis, JobOpportunity, CareerGrowthStep } from "@/types/career";
import type { RoadmapStep } from "@/types/roadmap";

const SECTION_HEADERS = [
  "Career Overview",
  "Skill Gap Analysis",
  "6-Month Learning Roadmap",
  "Job Roles & Opportunities",
  "Career Growth Path",
  "Personalized Advice",
] as const;

function splitSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let currentKey = "";
  let currentContent: string[] = [];

  const lines = text.split("\n");

  for (const line of lines) {
    const isHeader = SECTION_HEADERS.some(
      (h) => line.trim() === h || line.trim().startsWith(h + "\n") || line === h
    );
    const matchedHeader = SECTION_HEADERS.find((h) => line.includes(h) && line.trim().length < 50);

    if (matchedHeader && (line.trim() === matchedHeader || line.trim().startsWith(matchedHeader))) {
      if (currentKey) {
        sections[currentKey] = currentContent.join("\n").trim();
      }
      currentKey = matchedHeader;
      currentContent = [];
    } else {
      if (currentKey) currentContent.push(line);
    }
  }
  if (currentKey) {
    sections[currentKey] = currentContent.join("\n").trim();
  }
  return sections;
}

function parseCareerOverview(s: string): CareerPath[] {
  const careers: CareerPath[] = [];
  const blocks = s.split(/(?=\d\.|-\s+[A-Z][a-z]+ [A-Za-z]+\s*:)/).filter(Boolean);
  let current: Partial<CareerPath> = {};
  const lines = s.split("\n").filter((l) => l.trim());

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dashMatch = line.match(/^-\s+(.+?):\s*(.*)/);
    const titleMatch = line.match(/^(\d\.)?\s*([A-Za-z\s&\/]+(?:Analyst|Designer|Developer|Engineer|Manager|Specialist))(?:\s*[-–])?\s*(.*)/);
    if (titleMatch && titleMatch[2]) {
      if (current.title) careers.push(current as CareerPath);
      current = {
        title: titleMatch[2].trim(),
        reason: (titleMatch[3] || "").trim(),
        demand: "Medium",
      };
      const next = lines[i + 1];
      if (next && /high|medium|low demand/i.test(next)) {
        current.demand = next.toLowerCase().includes("high") ? "High" : next.toLowerCase().includes("low") ? "Low" : "Medium";
        i++;
      }
    } else if (dashMatch && current.title) {
      current.reason = (current.reason ? current.reason + " " : "") + dashMatch[2];
    } else if (current.title && line.trim() && !line.startsWith("-")) {
      current.reason = (current.reason ? current.reason + " " : "") + line.trim();
    }
  }
  if (current.title) careers.push(current as CareerPath);

  if (careers.length === 0) {
    const simpleSplit = s.split(/\n\n+/);
    for (const block of simpleSplit) {
      const lines = block.split("\n");
      const first = lines[0].replace(/^[-*\d.]\s*/, "").trim();
      if (first.length > 3 && first.length < 80) {
        careers.push({
          title: first,
          reason: lines.slice(1).join(" ").trim() || "Good fit based on your profile.",
          demand: block.toLowerCase().includes("high demand") ? "High" : block.toLowerCase().includes("low demand") ? "Low" : "Medium",
        });
      }
    }
  }
  return careers.slice(0, 3);
}

function parseSkillGap(s: string, careerTitles: string[]): SkillGapAnalysis[] {
  const analyses: SkillGapAnalysis[] = [];
  const priorityRegex = /(High|Medium|Low)/g;

  if (careerTitles.length === 0) careerTitles = ["Career 1"];

  for (const title of careerTitles) {
    const existing: string[] = [];
    const missing: Array<{ name: string; priority: "High" | "Medium" | "Low" }> = [];
    const lower = s.toLowerCase();
    const parts = s.split(/\n\n+|(?=Skills? (?:you |they )?(?:already have|to learn|missing))/i);
    for (const part of parts) {
      if (/already have|existing|current skills/i.test(part)) {
        const items = part.split("\n").flatMap((l) => l.replace(/^[-*]\s*/, "").trim()).filter((x) => x.length > 0 && x.length < 50);
        existing.push(...items.slice(0, 15));
      }
      if (/to learn|missing|must learn|need/i.test(part)) {
        const lines = part.split("\n");
        for (const line of lines) {
          const trimmed = line.replace(/^[-*]\s*/, "").trim();
          const pri = trimmed.match(priorityRegex);
          const priority = (pri && pri[0]) ? (pri[0] as "High" | "Medium" | "Low") : "Medium";
          const name = trimmed.replace(/\s*\((?:High|Medium|Low)\)\s*$/, "").trim();
          if (name.length > 1 && name.length < 60) missing.push({ name, priority });
        }
      }
    }
    if (existing.length === 0 && missing.length === 0) {
      const bulletLines = s.split("\n").filter((l) => l.trim().startsWith("-"));
      for (const line of bulletLines) {
        const t = line.replace(/^[-*]\s*/, "").trim();
        if (t.toLowerCase().includes("learn") || t.match(priorityRegex)) {
          const p = t.match(priorityRegex);
          missing.push({ name: t.replace(/\s*\((?:High|Medium|Low)\)\s*$/, "").trim(), priority: (p && p[0]) as "High" | "Medium" | "Low" ?? "Medium" });
        } else if (t.length < 40) existing.push(t);
      }
    }
    analyses.push({ careerTitle: title, existingSkills: existing.slice(0, 20), missingSkills: missing.slice(0, 15) });
  }
  return analyses;
}

function parseRoadmap(s: string): RoadmapStep[] {
  const steps: RoadmapStep[] = [];
  const monthBlocks = s.split(/(?:Month|Month\s)\s*(\d)/i).filter(Boolean);
  for (let m = 1; m <= 6; m++) {
    const block = s.includes(`Month ${m}`) ? s.split(`Month ${m}`)[1]?.split(/Month \d/)[0] ?? "" : monthBlocks[m] ?? "";
    const topics: string[] = [];
    const tools: string[] = [];
    const resources: string[] = [];
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const t = line.replace(/^[-*]\s*/, "");
      if (/topic|learn|focus/i.test(line) && !/tool|resource|platform/i.test(line)) topics.push(t);
      else if (/tool|software|practice/i.test(line)) tools.push(t);
      else if (/resource|platform|coursera|youtube|udemy|free/i.test(line)) resources.push(t);
      else if (t.length > 5 && t.length < 120 && !topics.includes(t)) topics.push(t);
    }
    steps.push({
      month_number: m,
      topics: topics.length ? topics : ["Structured learning for this month"],
      tools: tools.length ? tools : [],
      resources: resources.length ? resources : [],
    });
  }
  return steps;
}

function parseJobRoles(s: string): JobOpportunity[] {
  const roles: JobOpportunity[] = [];
  const lines = s.split("\n").filter((l) => l.trim());
  let currentType: "Job" | "Internship" | "Freelance" = "Job";
  for (const line of lines) {
    const t = line.replace(/^[-*]\s*/, "").trim();
    if (/internship/i.test(line)) currentType = "Internship";
    else if (/freelance|project idea/i.test(line)) currentType = "Freelance";
    else if (t.length > 10 && t.length < 150) {
      roles.push({ role_type: currentType, title: t.slice(0, 100), description: t.length > 100 ? t : undefined });
    }
  }
  if (roles.length === 0) {
    lines.forEach((l) => {
      const t = l.replace(/^[-*]\s*/, "").trim();
      if (t.length > 5 && t.length < 120) roles.push({ role_type: "Job", title: t });
    });
  }
  return roles.slice(0, 12);
}

function parseGrowthPath(s: string): CareerGrowthStep[] {
  const steps: CareerGrowthStep[] = [];
  const lines = s.split("\n").filter((l) => l.trim());
  const yearRegex = /(?:Year|Years?)\s*(\d)[\s-–]+(\d)?|(\d)[\s-–]+\d\s*years?/i;
  for (const line of lines) {
    const trimmed = line.replace(/^[-*]\s*/, "").trim();
    const yearMatch = trimmed.match(yearRegex) || trimmed.match(/(\d)/);
    const roleMatch = trimmed.match(/(?:Junior|Mid|Senior|Lead|Manager|Specialist|Engineer|Analyst)[^.]*/i);
    const salaryMatch = trimmed.match(/(?:salary|approx|range|₹|\\$|USD)[^.]*/i);
    if (yearMatch || roleMatch) {
      steps.push({
        year_range: yearMatch ? `Year ${yearMatch[1]}${yearMatch[2] ? `-${yearMatch[2]}` : ""}` : "Next 3-5 years",
        role_title: roleMatch ? roleMatch[0].trim() : trimmed.slice(0, 60),
        salary_range: salaryMatch ? salaryMatch[0].trim() : undefined,
      });
    }
  }
  if (steps.length === 0) {
    steps.push(
      { year_range: "Year 1-2", role_title: "Entry-level / Junior", salary_range: "Varies by role" },
      { year_range: "Year 3-4", role_title: "Mid-level", salary_range: "Growth with experience" },
      { year_range: "Year 5+", role_title: "Senior / Specialist", salary_range: "Competitive" }
    );
  }
  return steps.slice(0, 6);
}

function parseAdvice(s: string): string[] {
  return s
    .split("\n")
    .map((l) => l.replace(/^[-*\d.]\s*/, "").trim())
    .filter((l) => l.length > 15 && l.length < 300)
    .slice(0, 5);
}

export function parseCareerResponse(rawText: string): ParsedCareerResponse {
  const sections = splitSections(rawText);

  const careerOverview = parseCareerOverview(sections["Career Overview"] ?? rawText.slice(0, 1500));
  const careerTitles = careerOverview.map((c) => c.title);
  const skillGapAnalysis = parseSkillGap(sections["Skill Gap Analysis"] ?? "", careerTitles);
  const roadmapSection = sections["6-Month Learning Roadmap"] ?? sections["Learning Roadmap"] ?? "";
  const steps = parseRoadmap(roadmapSection || rawText);
  const jobRolesAndOpportunities = parseJobRoles(sections["Job Roles & Opportunities"] ?? "");
  const careerGrowthPath = parseGrowthPath(sections["Career Growth Path"] ?? "");
  const personalizedAdvice = parseAdvice(sections["Personalized Advice"] ?? "");

  return {
    careerOverview: careerOverview.length ? careerOverview : [{ title: "Career Path", reason: "Based on your profile.", demand: "Medium" }],
    skillGapAnalysis: skillGapAnalysis.length ? skillGapAnalysis : careerTitles.map((t) => ({ careerTitle: t, existingSkills: [], missingSkills: [] })),
    learningRoadmap: { duration_months: 6, steps: steps.length ? steps : Array.from({ length: 6 }, (_, i) => ({ month_number: i + 1, topics: [], tools: [], resources: [] })) },
    jobRolesAndOpportunities: jobRolesAndOpportunities.length ? jobRolesAndOpportunities : [],
    careerGrowthPath: careerGrowthPath.length ? careerGrowthPath : parseGrowthPath(""),
    personalizedAdvice: personalizedAdvice.length ? personalizedAdvice : ["Keep building skills and stay curious.", "Network with professionals in your target field.", "Apply for internships or small projects to gain experience."],
  };
}
