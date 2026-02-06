export const APP_NAME = "SkillBridge";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover Careers" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export const EDUCATION_LEVELS = [
  "High School",
  "Undergraduate (B.Tech / B.Sc / B.Com)",
  "Postgraduate",
  "Diploma",
  "Other",
] as const;

export const DEMAND_LABELS = {
  High: "High Demand",
  Medium: "Medium Demand",
  Low: "Low Demand",
} as const;

export const PRIORITY_COLORS = {
  High: "high",
  Medium: "medium",
  Low: "low",
} as const;
