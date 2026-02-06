import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import type { CareerGrowthStep } from "@/types/career";

export interface GrowthPathProps {
  steps: CareerGrowthStep[];
  careerTitle?: string;
}

export default function GrowthPath({ steps, careerTitle }: GrowthPathProps) {
  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>{careerTitle ? `${careerTitle} — Growth Path` : "Career Growth Path"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-[var(--primary)]" />
                {i < steps.length - 1 && (
                  <div className="mt-1 h-full w-px flex-1 bg-[var(--border)]" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <p className="font-medium text-[var(--foreground)]">{step.year_range}</p>
                <p className="text-[var(--muted)]">{step.role_title}</p>
                {step.salary_range && (
                  <p className="mt-1 text-sm text-[var(--muted)]">Approx. {step.salary_range}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
