"use client";

import { useEffect, useState } from "react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { storage } from "@/utils/storage";

interface CareerData {
  id: string | number;
  career?: {
    career_title?: string;
    demand_level?: string;
  };
  title?: string;
  demand?: string;
}

interface CareerOverviewItem {
  title: string;
  demand: string;
}

interface SavedCareersProps {
  userId?: string;
}

export default function SavedCareers({ userId }: SavedCareersProps) {
  const [careers, setCareers] = useState<CareerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCareers() {
      if (!userId) {
        // Fall back to sessionStorage if no userId (not authenticated)
        const data = storage.getJSON<{ careerOverview?: CareerOverviewItem[] }>("skillbridge_result");
        if (data?.careerOverview) {
          setCareers(data.careerOverview.map((c: CareerOverviewItem, i: number) => ({
            id: i,
            career: { career_title: c.title, demand_level: c.demand }
          })));
        }
        setLoading(false);
        return;
      }

      try {
        // Fetch from API route instead of directly calling service
        const { supabase } = await import("@/lib/supabase");
        if (!supabase) {
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/dashboard/saved-careers", {
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setCareers(result.careers || []);
        }
      } catch (err) {
        // Silently handle error - user may see empty list
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
            {careers.map((item: CareerData) => (
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
