"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ParsedCareerResponse } from "@/types/ai-response";
import CareerCard from "@/components/career/CareerCard";
import SkillGapCard from "@/components/career/SkillGapCard";
import GrowthPath from "@/components/career/GrowthPath";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ResultsPage() {
  const [data, setData] = useState<ParsedCareerResponse | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("skillbridge_result");
      if (raw) setData(JSON.parse(raw) as ParsedCareerResponse);
    } catch {
      setData(null);
    }
  }, []);

  if (data === null) {
    return (
      <div className="section-bg flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>No results yet</CardTitle>
            <p className="mt-2 text-[var(--muted)]">
              Complete the career discovery form to see your personalized career paths and roadmap.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/discover">
              <Button fullWidth>Get My Career Roadmap</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { careerOverview, skillGapAnalysis, learningRoadmap, jobRolesAndOpportunities, careerGrowthPath, personalizedAdvice } = data;

  return (
    <div className="min-h-screen section-bg">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">
          Your Career Guidance
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Personalized for you. Save or revisit from your dashboard.
        </p>

        {/* Section 1: Career Overview */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Career Overview</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {careerOverview.map((career, i) => (
              <CareerCard key={i} career={career} />
            ))}
          </div>
        </section>

        {/* Section 2: Skill Gap Analysis */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Skill Gap Analysis</h2>
          <div className="mt-4 space-y-6">
            {skillGapAnalysis.map((analysis, i) => (
              <SkillGapCard key={i} analysis={analysis} />
            ))}
          </div>
        </section>

        {/* Section 3: 6-Month Roadmap */}
        <section className="mt-14">
          <RoadmapTimeline steps={learningRoadmap.steps} />
        </section>

        {/* Section 4: Job Roles & Opportunities */}
        {jobRolesAndOpportunities.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Job Roles & Opportunities</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {jobRolesAndOpportunities.map((role, i) => (
                <Card key={i}>
                  <CardHeader>
                    <span className="rounded-full bg-[var(--section-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
                      {role.role_type}
                    </span>
                    <CardTitle className="text-base">{role.title}</CardTitle>
                  </CardHeader>
                  {role.description && (
                    <CardContent>
                      <p className="text-sm text-[var(--muted)]">{role.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Career Growth Path */}
        {careerGrowthPath.length > 0 && (
          <section className="mt-14">
            <GrowthPath steps={careerGrowthPath} />
          </section>
        )}

        {/* Section 6: Personalized Advice */}
        {personalizedAdvice.length > 0 && (
          <section className="mt-14">
            <Card className="border-l-4 border-l-[var(--primary)] bg-[var(--primary)]/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>💡</span>
                  <CardTitle>Personalized Advice</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-[var(--foreground)]">
                  {personalizedAdvice.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        <div className="mt-14 flex flex-wrap gap-4">
          <Link href="/discover">
            <Button variant="outline">Try Again with New Inputs</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
