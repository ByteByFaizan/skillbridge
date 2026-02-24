import { NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/**
 * POST /api/auth/signup
 *
 * Creates a new user with email + password via Supabase Auth.
 * On success returns 200 with { user }. If the email requires
 * confirmation, Supabase will send a verification email automatically.
 */
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

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
        { error: error.message },
        { status: error.status ?? 400 }
      );
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
