import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";
import { SignupSchema } from "@/utils/validators";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/auth/signup
 *
 * Creates a new user with email + password via Supabase Auth.
 * On success returns 200 with { user }. If the email requires
 * confirmation, Supabase will send a verification email automatically.
 * Includes rate limiting and input validation.
 */
export async function POST(request: NextRequest) {
  try {
    /* ── Rate limit by IP ─────────────────────────────── */
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const rl = checkRateLimit(`auth:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many signup attempts. Please try again later." } },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 0) / 1000)),
          },
        }
      );
    }

    /* ── Parse JSON safely ────────────────────────────── */
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } },
        { status: 400 }
      );
    }

    /* ── Validate input ───────────────────────────────── */
    const parsed = SignupSchema.safeParse(body);
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

    const { email, password, name } = parsed.data;

    const supabase = await getSupabaseAuth();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name ?? "" },
        emailRedirectTo: `${new URL(request.url).origin}/api/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: { code: "AUTH_ERROR", message: error.message } },
        { status: error.status ?? 400 }
      );
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (err) {
    console.error("[auth/signup] Unhandled error:", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
}
