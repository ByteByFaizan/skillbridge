"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import type { CareerPath } from "@/types/career";

export default function SavedCareers() {
  const [careers, setCareers] = useState<CareerPath[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("skillbridge_result");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.careerOverview?.length) setCareers(data.careerOverview);
      }
    } catch {
      setCareers([]);
    }
  }, []);

  if (careers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Careers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[var(--muted)]">No saved careers yet.</p>
          <Link
            href="/discover"
            className="mt-3 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
          >
            Discover your first career path →
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Careers</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {careers.map((c, i) => (
            <li key={i}>
              <Link
                href="/results"
                className="block rounded-lg py-2 px-3 text-[var(--foreground)] hover:bg-[var(--section-bg)]"
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/results"
          className="mt-3 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
        >
          View full results →
        </Link>
      </CardContent>
    </Card>
  );
}
