"use client";

import { useState } from "react";
import Link from "next/link";
import type { ParsedCareerResponse } from "@/types/ai-response";
import CareerCard from "@/components/career/CareerCard";
import SkillGapCard from "@/components/career/SkillGapCard";
import GrowthPath from "@/components/career/GrowthPath";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { storage } from "@/utils/storage";

function getStoredResult(): ParsedCareerResponse | null {
  return storage.getJSON<ParsedCareerResponse>("skillbridge_result");
}

export default function ResultsPage() {
  const [data] = useState<ParsedCareerResponse | null>(() => getStoredResult());
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!data) return;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skillbridge-career-guidance-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  if (data === null) {
    return (
      <div className="section-bg flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <svg className="h-8 w-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <CardTitle>Let&apos;s find your first career path!</CardTitle>
            <p className="mt-2 text-[var(--muted)]">
              Complete the quick form to get personalized career suggestions and a 6-month learning roadmap — takes less than a minute.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/discover">
              <Button fullWidth size="lg">Get My Career Roadmap</Button>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">
              Your Career Guidance
            </h1>
            <p className="mt-1 text-[var(--muted)]">
              Personalized for you. Save or revisit from your dashboard.
            </p>
          </div>
          <div className="flex gap-2 no-print">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex items-center gap-2"
              aria-label="Copy link to results"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {copied ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : copyError ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                )}
              </svg>
              {copied ? "Copied!" : copyError ? "Failed" : "Copy Link"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
              aria-label="Print career guidance"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
              aria-label="Download as JSON"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Save
            </Button>
          </div>
        </div>

        {/* Section 1: Career Overview */}
        <section className="mt-12" id="overview" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-xl font-semibold text-[var(--foreground)]">
            Career Overview
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {careerOverview.map((career, i) => (
              <div key={i} role="listitem">
                <CareerCard career={career} />
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Skill Gap Analysis */}
        <section className="mt-14" id="skill-gap" aria-labelledby="skill-gap-heading">
          <h2 id="skill-gap-heading" className="text-xl font-semibold text-[var(--foreground)]">
            Skill Gap Analysis
          </h2>
          <div className="mt-4 space-y-6">
            {skillGapAnalysis.map((analysis, i) => (
              <SkillGapCard key={i} analysis={analysis} />
            ))}
          </div>
        </section>

        {/* Section 3: 6-Month Roadmap */}
        <section className="mt-14" id="roadmap" aria-labelledby="roadmap-heading">
          <h2 id="roadmap-heading" className="sr-only">Learning Roadmap</h2>
          <RoadmapTimeline steps={learningRoadmap.steps} />
        </section>

        {/* Section 4: Job Roles & Opportunities */}
        {jobRolesAndOpportunities.length > 0 && (
          <section className="mt-14" id="opportunities" aria-labelledby="opportunities-heading">
            <h2 id="opportunities-heading" className="text-xl font-semibold text-[var(--foreground)]">
              Job Roles & Opportunities
            </h2>
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
          <section className="mt-14" id="growth" aria-labelledby="growth-heading">
            <h2 id="growth-heading" className="sr-only">Career Growth Path</h2>
            <GrowthPath steps={careerGrowthPath} />
          </section>
        )}

        {/* Section 6: Personalized Advice */}
        {personalizedAdvice.length > 0 && (
          <section className="mt-14" id="advice" aria-labelledby="advice-heading">
            <Card className="border-l-4 border-l-[var(--primary)] bg-[var(--primary)]/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">💡</span>
                  <CardTitle id="advice-heading">Personalized Advice</CardTitle>
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
