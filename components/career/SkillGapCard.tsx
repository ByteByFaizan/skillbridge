import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { SkillGapAnalysis } from "@/types/career";

export interface SkillGapCardProps {
  analysis: SkillGapAnalysis;
}

export default function SkillGapCard({ analysis }: SkillGapCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{analysis.careerTitle} — Skill Gap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Skills you already have</p>
          <div className="flex flex-wrap gap-2">
            {analysis.existingSkills.length ? (
              analysis.existingSkills.map((skill, i) => (
                <Badge key={`${analysis.careerTitle}-existing-${i}`} variant="success">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-[var(--muted)]">None listed</span>
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Skills to learn</p>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.length ? (
              analysis.missingSkills.map(({ name, priority }, i) => (
                <Badge
                  key={`${analysis.careerTitle}-missing-${i}`}
                  variant={priority === "High" ? "high" : priority === "Medium" ? "medium" : "low"}
                >
                  {name} ({priority})
                </Badge>
              ))
            ) : (
              <span className="text-sm text-[var(--muted)]">None listed</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
