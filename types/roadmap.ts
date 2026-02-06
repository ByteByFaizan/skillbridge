export interface RoadmapStep {
  month_number: number;
  topics: string[];
  tools: string[];
  resources: string[];
}

export interface LearningRoadmap {
  duration_months: number;
  steps: RoadmapStep[];
}
