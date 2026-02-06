import RoadmapMonth from "./RoadmapMonth";
import type { RoadmapStep } from "@/types/roadmap";

export interface RoadmapTimelineProps {
  steps: RoadmapStep[];
}

export default function RoadmapTimeline({ steps }: RoadmapTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--foreground)]">6-Month Learning Roadmap</h3>
      <div className="relative space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            <RoadmapMonth step={step} />
            {i < steps.length - 1 && (
              <div className="absolute left-5 top-14 h-6 w-px bg-[var(--border)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
