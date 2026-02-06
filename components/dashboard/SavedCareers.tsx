"use client";

import { useEffect, useState } from "react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

interface SavedCareersProps {
  userId?: string;
}

export default function SavedCareers({ userId }: SavedCareersProps) {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCareers() {
      if (!userId) {
        // Fall back to sessionStorage if no userId (not authenticated)
        try {
          const raw = sessionStorage.getItem("skillbridge_result");
          if (raw) {
            const data = JSON.parse(raw);
            if (data.careerOverview) {
              setCareers(data.careerOverview.map((c: any, i: number) => ({
                id: i,
                career: { career_title: c.title, demand_level: c.demand }
              })));
            }
          }
        } catch (err) {
          console.error("Error loading from session:", err);
        }
        setLoading(false);
        return;
      }

      try {
        const { getSavedCareers } = await import("@/services/database/career.service");
        const data = await getSavedCareers(userId);
        setCareers(data);
      } catch (err) {
        console.error("Error loading saved careers:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCareers();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Careers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[var(--muted)]">Loading...</p>
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
        {careers.length > 0 ? (
          <ul className="space-y-3">
            {careers.map((item: any) => (
              <li
                key={item.id}
                className="rounded-lg border border-[var(--border)] p-3 hover:bg-[var(--section-bg)] transition"
              >
                <h3 className="font-medium text-[var(--foreground)]">
                  {item.career?.career_title || item.title || "Career"}
                </h3>
                <span className="inline-block mt-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs text-[var(--primary)]">
                  {item.career?.demand_level || item.demand || "Medium"} Demand
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="text-[var(--muted)]">No saved careers yet.</p>
            <Link
              href="/discover"
              className="mt-3 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Discover your first career path →
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
