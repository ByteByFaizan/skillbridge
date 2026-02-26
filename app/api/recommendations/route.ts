import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/* ═══════════════════════════════════════════════════════
   GET /api/recommendations
   List recent runs for the current user or anonymous session.
   For authenticated users: returns runs matching user_id OR
   legacy runs (user_id IS NULL) matching the current session_id.
   ═══════════════════════════════════════════════════════ */

export async function GET() {
  try {
    // Resolve authenticated user and anonymous session in parallel (async-api-routes)
    const [authResult, sessionId] = await Promise.all([
      getSupabaseAuth().then((c) => c.auth.getUser()),
      getSessionId(),
    ]);

    const authUser = authResult.data.user ?? null;

    // No identity at all — return empty
    if (!authUser && !sessionId) {
      return NextResponse.json({ runs: [] }, { status: 200 });
    }

    const db = getSupabaseServer();

    let data: Array<{ id: string; created_at: string; report: unknown }> | null = null;

    if (authUser && sessionId) {
      // Authenticated user WITH a session cookie — fetch both:
      // (a) runs owned by this user (cross-device) AND
      // (b) legacy runs on the current device session (user_id IS NULL)
      // Use .or() to combine both conditions
      const { data: rows, error } = await db
        .from("recommendation_runs")
        .select("id, created_at, report")
        .or(`user_id.eq.${authUser.id},and(session_id.eq.${sessionId},user_id.is.null)`)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("[/api/recommendations] DB error:", error);
        return NextResponse.json(
          { error: { code: "DB_ERROR", message: "Failed to fetch recommendations." } },
          { status: 500 }
        );
      }
      data = rows;
    } else if (authUser) {
      // Authenticated user with no session cookie
      const { data: rows, error } = await db
        .from("recommendation_runs")
        .select("id, created_at, report")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("[/api/recommendations] DB error:", error);
        return NextResponse.json(
          { error: { code: "DB_ERROR", message: "Failed to fetch recommendations." } },
          { status: 500 }
        );
      }
      data = rows;
    } else {
      // Anonymous user — session_id only
      const { data: rows, error } = await db
        .from("recommendation_runs")
        .select("id, created_at, report")
        .eq("session_id", sessionId!)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("[/api/recommendations] DB error:", error);
        return NextResponse.json(
          { error: { code: "DB_ERROR", message: "Failed to fetch recommendations." } },
          { status: 500 }
        );
      }
      data = rows;
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
