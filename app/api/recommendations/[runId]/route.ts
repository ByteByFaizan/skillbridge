import { NextRequest, NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

// Best practice (js-hoist-regexp): hoist regex outside the handler
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ═══════════════════════════════════════════════════════
   GET /api/recommendations/[runId]
   Fetch a single run's full report. Verifies ownership by:
   1. user_id match (cross-device, authenticated users)
   2. session_id match (anonymous / legacy rows with user_id=NULL)
   ═══════════════════════════════════════════════════════ */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    // Start all reads in parallel
    const [{ runId }, authClient, sessionId] = await Promise.all([
      params,
      getSupabaseAuth(),
      getSessionId(),
    ]);

    const { data: { user: authUser } } = await authClient.auth.getUser();

    // Must have at least one identity
    if (!authUser && !sessionId) {
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

    let data = null;

    if (authUser) {
      // Try by user_id first (works for new cross-device runs)
      const { data: byUser } = await db
        .from("recommendation_runs")
        .select("id, session_id, user_id, input, report, created_at")
        .eq("id", runId)
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (byUser) {
        data = byUser;
      } else if (sessionId) {
        // Fallback: legacy row with user_id=NULL but matching session on this device
        const { data: bySession } = await db
          .from("recommendation_runs")
          .select("id, session_id, user_id, input, report, created_at")
          .eq("id", runId)
          .eq("session_id", sessionId)
          .maybeSingle();

        if (bySession) {
          data = bySession;
          // Opportunistically backfill user_id so this run works cross-device going forward
          await db
            .from("recommendation_runs")
            .update({ user_id: authUser.id })
            .eq("id", runId)
            .is("user_id", null);
        }
      }
    } else {
      // Anonymous user — session_id only
      const { data: bySession } = await db
        .from("recommendation_runs")
        .select("id, session_id, user_id, input, report, created_at")
        .eq("id", runId)
        .eq("session_id", sessionId!)
        .maybeSingle();
      data = bySession;
    }

    if (!data) {
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
