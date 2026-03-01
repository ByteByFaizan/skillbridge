import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/**
 * GET /auth/confirm
 *
 * Handles the redirect from Supabase recovery / signup confirmation emails.
 *
 * Supports two flows:
 *  1. PKCE ({{ .ConfirmationURL }})  → receives a `code` query-param
 *  2. Token-hash                     → receives `token_hash` + `type`
 *
 * After verification, redirects to the `next` param (defaults to `/dashboard`).
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const code = searchParams.get("code");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/dashboard";

    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = next;
    redirectTo.searchParams.delete("token_hash");
    redirectTo.searchParams.delete("type");
    redirectTo.searchParams.delete("code");
    redirectTo.searchParams.delete("next");

    const supabase = await getSupabaseAuth();

    // Flow 1: PKCE — {{ .ConfirmationURL }} redirects here with a `code`
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(redirectTo);
        }

        console.error("[auth/confirm] Code exchange failed:", error.message);
    }

    // Flow 2: Token-hash — custom email template with {{ .TokenHash }}
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (!error) {
            return NextResponse.redirect(redirectTo);
        }

        console.error("[auth/confirm] OTP verification failed:", error.message);
    }

    // Fallback: send to login with an error hint
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "auth_callback_failed");
    return NextResponse.redirect(redirectTo);
}
