import { NextRequest, NextResponse } from "next/server";
import { CareerInputSchema } from "@/utils/validators";
import { generateCareerReport } from "@/services/ai/openrouter";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAuth } from "@/lib/supabase-auth";
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

    /* ── 2. Rate limit (early exit) ──────────────────── */
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: `Too many requests. Try again in ${Math.ceil((rl.retryAfterMs ?? 0) / 60000)} minutes.`,
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 0) / 1000)),
          },
        }
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

    const input = parsed.data;

    /* ── 4. Session + AI call + auth user in parallel ───── */
    // Best practice (async-parallel): start independent work concurrently
    const [sessionId, reportResult, authResult] = await Promise.allSettled([
      getSessionId(),
      generateCareerReport(input),
      getSupabaseAuth().then((c) => c.auth.getUser()),
    ]);

    // Resolve authenticated user (null for anonymous users)
    const authUserId =
      authResult.status === "fulfilled"
        ? (authResult.value.data.user?.id ?? null)
        : null;

    // Resolve session
    const existingSessionId =
      sessionId.status === "fulfilled" ? sessionId.value : null;
    const isNew = !existingSessionId;
    const finalSessionId = existingSessionId ?? crypto.randomUUID();

    // Check AI result
    if (reportResult.status === "rejected") {
      console.error("[/api/career] AI generation failed:", reportResult.reason);
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

    const report = reportResult.value;

    /* ── 5. Persist to Supabase ──────────────────────── */
    const db = getSupabaseServer();

    const { data: row, error: dbError } = await db
      .from("recommendation_runs")
      .insert({
        session_id: finalSessionId,
        user_id: authUserId,
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
      // BUG FIX: If DB insert fails, return an error instead of a fake runId
      // that won't be fetchable from /api/recommendations/[runId].
      return NextResponse.json(
        {
          error: {
            code: "DB_ERROR",
            message:
              "Your report was generated but could not be saved. Please try again.",
          },
          // Include the report so the client can still display it
          report,
        },
        { status: 500 }
      );
    }

    const runId: string = row.id;

    /* ── 6. Build response ───────────────────────────── */
    const res = NextResponse.json({ runId, report }, { status: 200 });

    if (isNew) {
      setSessionCookie(res, finalSessionId);
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
