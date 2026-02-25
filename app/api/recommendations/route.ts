import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/* ═══════════════════════════════════════════════════════
   GET /api/recommendations
   List recent runs for the current user or anonymous session.
   ═══════════════════════════════════════════════════════ */

export async function GET() {
  try {
    // Resolve authenticated user and anonymous session in parallel
    const [authClient, sessionId] = await Promise.all([
      getSupabaseAuth(),
      getSessionId(),
    ]);

    const { data: { user: authUser } } = await authClient.auth.getUser();

    // No identity at all — return empty
    if (!authUser && !sessionId) {
      return NextResponse.json({ runs: [] }, { status: 200 });
    }

    const db = getSupabaseServer();

    // Prefer user_id (works cross-device), fall back to session_id for anonymous users
    const query = db
      .from("recommendation_runs")
      .select("id, created_at, report")
      .order("created_at", { ascending: false })
      .limit(20);

    const { data, error } = authUser
      ? await query.eq("user_id", authUser.id)
      : await query.eq("session_id", sessionId!);

    if (error) {
      console.error("[/api/recommendations] DB error:", error);
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: "Failed to fetch recommendations." } },
        { status: 500 }
      );
    }

    // Return lightweight summaries with career titles extracted from the report
    const runs = [];
    for (const row of data ?? []) {
      const report = row.report as {
        careerOverview?: Array<{ title?: string }>;
      } | null;

      const careerTitles: string[] = [];
      if (report?.careerOverview) {
        for (const c of report.careerOverview) {
          if (c.title) {
            careerTitles.push(c.title);
            if (careerTitles.length >= 3) break;
          }
        }
      }

      runs.push({
        runId: row.id,
        createdAt: row.created_at,
        careerTitles,
      });
    }

    return NextResponse.json(
      { runs },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=30, stale-while-revalidate=10",
        },
      }
    );
  } catch (err) {
    console.error("[/api/recommendations] Unhandled error:", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
}
