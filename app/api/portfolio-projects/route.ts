import { NextRequest, NextResponse } from "next/server";
import { PortfolioGenerateInputSchema } from "@/utils/validators";
import { generatePortfolioProjects } from "@/services/ai/nvidia";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAuth } from "@/lib/supabase-auth";
import { getSessionId } from "@/lib/session";

/* ═══════════════════════════════════════════════════════
   GET /api/portfolio-projects?runId=xxx
   Fetch saved portfolio projects for a given roadmap run.
   Returns { projects, scope } or { projects: null }.
   ═══════════════════════════════════════════════════════ */

export async function GET(req: NextRequest) {
  try {
    const runId = req.nextUrl.searchParams.get("runId");
    if (!runId) {
      return NextResponse.json(
        { error: { code: "MISSING_PARAM", message: "runId is required." } },
        { status: 400 }
      );
    }

    // Verify ownership in parallel
    const [authResult, sessionId] = await Promise.all([
      getSupabaseAuth().then((c) => c.auth.getUser()),
      getSessionId(),
    ]);

    const authUser = authResult.data.user ?? null;

    if (!authUser && !sessionId) {
      return NextResponse.json({ projects: null }, { status: 200 });
    }

    const db = getSupabaseServer();

    // First verify the user owns this run
    let runOwned = false;

    if (authUser) {
      const { data: byUser } = await db
        .from("recommendation_runs")
        .select("id")
        .eq("id", runId)
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (byUser) {
        runOwned = true;
      } else if (sessionId) {
        const { data: bySession } = await db
          .from("recommendation_runs")
          .select("id")
          .eq("id", runId)
          .eq("session_id", sessionId)
          .maybeSingle();
        runOwned = !!bySession;
      }
    } else if (sessionId) {
      const { data: bySession } = await db
        .from("recommendation_runs")
        .select("id")
        .eq("id", runId)
        .eq("session_id", sessionId)
        .maybeSingle();
      runOwned = !!bySession;
    }

    if (!runOwned) {
      return NextResponse.json({ projects: null }, { status: 200 });
    }

    // Fetch saved portfolio projects
    const { data, error } = await db
      .from("portfolio_projects")
      .select("projects, scope")
      .eq("run_id", runId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[/api/portfolio-projects] DB error:", error);
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: "Failed to fetch projects." } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        projects: data?.projects ?? null,
        scope: data?.scope ?? null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=30, stale-while-revalidate=10",
        },
      }
    );
  } catch (err) {
    console.error("[/api/portfolio-projects] GET error:", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
}

/* ═══════════════════════════════════════════════════════
   POST /api/portfolio-projects
   Generate new portfolio projects via AI and persist.
   Body: { runId: string, scope?: "weekend" | "sprint" | "capstone" }
   ═══════════════════════════════════════════════════════ */

export async function POST(req: NextRequest) {
  try {
    /* ── 1. Parse & validate body ─────────────────────── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } },
        { status: 400 }
      );
    }

    const parsed = PortfolioGenerateInputSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error?.issues
        ? parsed.error.issues
          .map((i: { path?: unknown[]; message?: string }) =>
            `${(i.path ?? []).join(".")}: ${i.message}`
          )
          .join("; ")
        : "Invalid input";
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message } },
        { status: 400 }
      );
    }

    const { runId, scope } = parsed.data;

    /* ── 2. Auth + session ────────────────────────────── */
    const [authResult, sessionId] = await Promise.all([
      getSupabaseAuth().then((c) => c.auth.getUser()),
      getSessionId(),
    ]);

    const authUser = authResult.data.user ?? null;

    if (!authUser && !sessionId) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
        { status: 401 }
      );
    }

    /* ── 3. Fetch the roadmap report for context ──────── */
    const db = getSupabaseServer();

    let runData: { report: unknown; user_id: string | null } | null = null;

    if (authUser) {
      const { data: byUser } = await db
        .from("recommendation_runs")
        .select("report, user_id")
        .eq("id", runId)
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (byUser) {
        runData = byUser;
      } else if (sessionId) {
        const { data: bySession } = await db
          .from("recommendation_runs")
          .select("report, user_id")
          .eq("id", runId)
          .eq("session_id", sessionId)
          .maybeSingle();
        runData = bySession;
      }
    } else if (sessionId) {
      const { data: bySession } = await db
        .from("recommendation_runs")
        .select("report, user_id")
        .eq("id", runId)
        .eq("session_id", sessionId)
        .maybeSingle();
      runData = bySession;
    }

    if (!runData) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Roadmap run not found." } },
        { status: 404 }
      );
    }

    /* ── 4. Extract skill gap data from report ─────────── */
    const report = runData.report as {
      careerOverview?: Array<{ title: string; why: string; demandLevel: "High" | "Medium" | "Low" }>;
      skillGapAnalysis?: Array<{
        careerTitle: string;
        existingSkills: Array<{ name: string }>;
        missingSkills: Array<{ name: string; priority: string }>;
      }>;
    };

    if (!report?.careerOverview || !report?.skillGapAnalysis) {
      return NextResponse.json(
        { error: { code: "INVALID_REPORT", message: "Report data is incomplete." } },
        { status: 400 }
      );
    }

    /* ── 5. Generate projects via AI ───────────────────── */
    const projects = await generatePortfolioProjects({
      careerOverview: report.careerOverview,
      skillGapAnalysis: report.skillGapAnalysis,
      scope,
    });

    /* ── 6. Upsert into Supabase ──────────────────────── */
    // Delete existing projects for this run (on-demand regeneration)
    await db
      .from("portfolio_projects")
      .delete()
      .eq("run_id", runId);

    const { error: insertError } = await db
      .from("portfolio_projects")
      .insert({
        run_id: runId,
        user_id: authUser?.id ?? null,
        projects,
        scope,
      });

    if (insertError) {
      console.error("[/api/portfolio-projects] Insert error:", insertError);
      // Still return the projects even if persistence failed
      return NextResponse.json(
        { projects, scope, persisted: false },
        { status: 200 }
      );
    }

    return NextResponse.json({ projects, scope, persisted: true }, { status: 200 });
  } catch (err) {
    console.error("[/api/portfolio-projects] POST error:", err);

    // Distinguish AI errors from other errors
    const message = err instanceof Error && err.message.includes("NVIDIA")
      ? "Project generation failed. Please try again later."
      : "An unexpected error occurred.";

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
