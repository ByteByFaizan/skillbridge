import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";
import { LoginSchema } from "@/utils/validators";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/auth/login
 *
 * Signs in a user with email + password.
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
        { error: "Too many login attempts. Please try again later." },
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
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    /* ── Validate input ───────────────────────────────── */
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const supabase = await getSupabaseAuth();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 401 }
      );
    }

    return NextResponse.json(
      { user: data.user },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
