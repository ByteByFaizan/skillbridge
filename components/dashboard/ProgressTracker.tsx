"use client";

import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function ProgressTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roadmap Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[var(--muted)]">
          Your progress will appear here once you start following your learning roadmap.
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Complete the career discovery to get your 6-month roadmap.
        </p>
      </CardContent>
    </Card>
  );
}
