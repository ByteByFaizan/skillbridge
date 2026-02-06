import Card, { CardHeader, CardContent } from "@/components/ui/Card";
import type { RoadmapStep } from "@/types/roadmap";

export interface RoadmapMonthProps {
  step: RoadmapStep;
}

export default function RoadmapMonth({ step }: RoadmapMonthProps) {
  return (
    <Card className="flex gap-4">
      <div className="flex shrink-0 flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
          {step.month_number}
        </div>
        <span className="mt-1 text-xs font-medium text-[var(--muted)]">
          Month {step.month_number}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <CardHeader className="pb-1">
          <p className="text-sm font-medium text-[var(--foreground)]">Topics</p>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <ul className="list-inside list-disc text-sm text-[var(--muted)]">
            {step.topics.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          {step.tools.length > 0 && (
            <>
              <p className="text-sm font-medium text-[var(--foreground)]">Tools</p>
              <p className="text-sm text-[var(--muted)]">{step.tools.join(", ")}</p>
            </>
          )}
          {step.resources.length > 0 && (
            <>
              <p className="text-sm font-medium text-[var(--foreground)]">Resources</p>
              <div className="flex flex-wrap gap-1">
                {step.resources.map((r, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[var(--section-bg)] px-2 py-0.5 text-xs text-[var(--muted)]"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
