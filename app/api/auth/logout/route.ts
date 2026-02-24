import { NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/**
 * POST /api/auth/logout
 *
 * Signs the user out and clears the session cookies.
 */
export async function POST() {
  const supabase = await getSupabaseAuth();
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true }, { status: 200 });
}
