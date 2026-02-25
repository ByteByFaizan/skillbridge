import { NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/**
 * GET /api/auth/callback
 *
 * Handles the redirect from Supabase OAuth (Google, GitHub, etc.)
 * and magic-link emails.  Exchanges the `code` query-param for a
 * session, then redirects to `/dashboard`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Security: reject open-redirect attempts by only allowing relative paths
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//")
    ? rawNext
    : "/dashboard";

  if (code) {
    const supabase = await getSupabaseAuth();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[auth/callback] Code exchange failed:", error.message);
  }

  // If something went wrong, send back to login with an error hint
  return NextResponse.redirect(
    `${origin}/login?error=auth_callback_failed`
  );
}
