import { NextRequest, NextResponse } from "next/server";
import { CareerInputSchema } from "@/utils/validators";
import { generateCareerReport } from "@/services/ai/openrouter";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSessionId, setSessionCookie } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

/* ═══════════════════════════════════════════════════════
   POST /api/career
   ═══════════════════════════════════════════════════════ */

export async function POST(req: NextRequest) {
  try {
    /* ── 1. Determine client IP ──────────────────────── */
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    /* ── 2. Rate limit ───────────────────────────────── */
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: `Too many requests. Try again in ${Math.ceil((rl.retryAfterMs ?? 0) / 60000)} minutes.`,
          },
        },
        { status: 429 }
      );
    }

    /* ── 3. Parse & validate body ────────────────────── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } },
        { status: 400 }
      );
    }

    const parsed = CareerInputSchema.safeParse(body);
    if (!parsed.success) {
      const issues = (parsed as { error?: { issues?: Array<{ path?: unknown[]; message?: string }> } }).error?.issues;
      const message = issues
        ? issues.map((i) => `${(i.path ?? []).join(".")}: ${i.message}`).join("; ")
        : "Invalid input";
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message } },
        { status: 400 }
      );
    }

    const input = parsed.data!;

    /* ── 4. Session (create or reuse) ────────────────── */
    let sessionId = await getSessionId();
    const isNew = !sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    /* ── 5. Call OpenRouter AI ────────────────────────── */
    let report;
    try {
      report = await generateCareerReport(input);
    } catch (err) {
      console.error("[/api/career] AI generation failed:", err);
      return NextResponse.json(
        {
          error: {
            code: "AI_ERROR",
            message: "Career analysis failed. Please try again later.",
          },
        },
        { status: 500 }
      );
    }

    /* ── 6. Persist to Supabase ──────────────────────── */
    const db = getSupabaseServer();

    const { data: row, error: dbError } = await db
      .from("recommendation_runs")
      .insert({
        session_id: sessionId,
        input: {
          education: input.education,
          skills: input.skills,
          interests: input.interests,
          goal: input.goal || null,
          name: input.name || null,
        },
        report,
      })
      .select("id")
      .single();

    if (dbError || !row) {
      console.error("[/api/career] Supabase insert error:", dbError);
      // Still return the report — don't fail the user because of DB issues
    }

    const runId: string = row?.id ?? crypto.randomUUID();

    /* ── 7. Build response ───────────────────────────── */
    const res = NextResponse.json({ runId, report }, { status: 200 });

    if (isNew) {
      setSessionCookie(res, sessionId);
    }

    return res;
  } catch (err) {
    console.error("[/api/career] Unhandled error:", err);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred.",
        },
      },
      { status: 500 }
    );
  }
}
