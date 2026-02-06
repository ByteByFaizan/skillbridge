import RoadmapMonth from "./RoadmapMonth";
import type { RoadmapStep } from "@/types/roadmap";

export interface RoadmapTimelineProps {
  steps: RoadmapStep[];
}

export default function RoadmapTimeline({ steps }: RoadmapTimelineProps) {
  const lastMonthNumber = steps.length > 0 ? steps[steps.length - 1].month_number : -1;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--foreground)]">6-Month Learning Roadmap</h3>
      <div className="relative space-y-6">
        {steps.map((step) => (
          <div key={step.month_number} className="relative">
            <RoadmapMonth step={step} />
            {step.month_number !== lastMonthNumber && (
              <div className="absolute left-5 top-14 h-6 w-px bg-[var(--border)]" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
