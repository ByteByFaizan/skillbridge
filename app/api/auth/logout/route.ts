import { NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/**
 * POST /api/auth/logout
 *
 * Signs the user out and clears the session cookies.
 */
export async function POST() {
  const supabase = await getSupabaseAuth();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[auth/logout] signOut failed:", error.message);
    // Still return ok — the client-side session will be cleared anyway
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
