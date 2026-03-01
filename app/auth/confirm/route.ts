

import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/**
 * GET /auth/confirm
 *
 * Handles the redirect from Supabase recovery / signup confirmation emails.
 * Exchanges the `token_hash` query-param for a session, then redirects
 * to the URL specified in the `next` param (defaults to `/dashboard`).
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/dashboard";

    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = next;
    redirectTo.searchParams.delete("token_hash");
    redirectTo.searchParams.delete("type");
    redirectTo.searchParams.delete("next");

    if (token_hash && type) {
        const supabase = await getSupabaseAuth();
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
