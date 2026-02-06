"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SavedCareers from "@/components/dashboard/SavedCareers";
import ProgressTracker from "@/components/dashboard/ProgressTracker";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestAdvice, setLatestAdvice] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      // Fetch latest career recommendations from API route
      try {
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

        const response = await fetch("/api/dashboard/latest-recommendation", {
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data?.personalizedAdvice) {
            setLatestAdvice(result.data.personalizedAdvice.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err instanceof Error ? err.message : "Unknown error");
      }

      setLoading(false);
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="section-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
          <p className="mt-4 text-[var(--muted)]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="section-bg min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
          </h1>
          <p className="mt-1 text-[var(--muted)]">
            Your saved careers and progress in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SavedCareers userId={user.id} />
          <ProgressTracker />
        </div>

        {latestAdvice.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent AI Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-[var(--foreground)]">
                {latestAdvice.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {latestAdvice.length === 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--muted)]">
                You haven&apos;t received any career guidance yet. Complete the career discovery form to get personalized recommendations.
              </p>
              <Link href="/discover" className="mt-4 inline-block">
                <Button variant="outline" size="sm">Get Career Guidance</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <Link href="/discover">
            <Button>Get New Career Roadmap</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
