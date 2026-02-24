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

    if (!sessionId) {
      return NextResponse.json({ runs: [] }, { status: 200 });
    }

    const db = getSupabaseServer();

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
    const runs = (data ?? []).map((row) => {
      const report = row.report as {
        careerOverview?: Array<{ title?: string }>;
      } | null;
      const careerTitles =
        report?.careerOverview?.map((c) => c.title).filter(Boolean).slice(0, 3) ??
        [];
      return {
        runId: row.id,
        createdAt: row.created_at,
        careerTitles,
      };
    });

    return NextResponse.json({ runs }, { status: 200 });
  } catch (err) {
    console.error("[/api/recommendations] Unhandled error:", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
}
