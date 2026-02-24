import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase-server";

/* ═══════════════════════════════════════════════════════
   GET /api/recommendations
   List recent runs for the current anonymous session.
   ═══════════════════════════════════════════════════════ */

export async function GET() {
  try {
    const sessionId = await getSessionId();

    // Early exit: no session = no runs
    if (!sessionId) {
      return NextResponse.json({ runs: [] }, { status: 200 });
    }

    const db = getSupabaseServer();

    // Only select the columns we need — skip the full report JSONB for listing
    const { data, error } = await db
      .from("recommendation_runs")
      .select("id, created_at, report")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[/api/recommendations] DB error:", error);
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: "Failed to fetch recommendations." } },
        { status: 500 }
      );
    }

    // Return lightweight summaries with career titles extracted from the report
    // Best practice (js-combine-iterations): single loop to extract + transform
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
          // Short cache: list may change when user creates new reports
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
