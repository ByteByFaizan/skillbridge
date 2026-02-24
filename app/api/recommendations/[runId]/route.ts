import { NextRequest, NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase-server";

// Best practice (js-hoist-regexp): hoist regex outside the handler
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ═══════════════════════════════════════════════════════
   GET /api/recommendations/[runId]
   Fetch a single run's full report for the current session.
   ═══════════════════════════════════════════════════════ */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    // Best practice (async-parallel): start independent reads concurrently
    const [{ runId }, sessionId] = await Promise.all([
      params,
      getSessionId(),
    ]);

    if (!sessionId) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Run not found." } },
        { status: 404 }
      );
    }

    // Early exit for invalid UUID format
    if (!UUID_RE.test(runId)) {
      return NextResponse.json(
        { error: { code: "INVALID_ID", message: "Invalid run ID format." } },
        { status: 400 }
      );
    }

    const db = getSupabaseServer();

    const { data, error } = await db
      .from("recommendation_runs")
      .select("id, session_id, input, report, created_at")
      .eq("id", runId)
      .eq("session_id", sessionId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Run not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        runId: data.id,
        createdAt: data.created_at,
        input: data.input,
        report: data.report,
      },
      {
        status: 200,
        headers: {
          // Cache for 5 min — reports don't change after creation
          "Cache-Control": "private, max-age=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    console.error("[/api/recommendations/[runId]] Unhandled error:", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
}
