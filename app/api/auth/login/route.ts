import { NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/**
 * POST /api/auth/login
 *
 * Signs in a user with email + password.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

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
