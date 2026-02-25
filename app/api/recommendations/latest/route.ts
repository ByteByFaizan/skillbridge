import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAuth } from "@/lib/supabase-auth";

/* ═══════════════════════════════════════════════════════
   GET /api/recommendations/latest
   Returns the most recent run ID for the current user/session.
   Used by the dashboard to auto-load the last report cross-device.
   ═══════════════════════════════════════════════════════ */

export async function GET() {
    try {
        const [authClient, sessionId] = await Promise.all([
            getSupabaseAuth(),
            getSessionId(),
        ]);

        const { data: { user: authUser } } = await authClient.auth.getUser();

        if (!authUser && !sessionId) {
            return NextResponse.json({ runId: null }, { status: 200 });
        }

        const db = getSupabaseServer();

        const query = db
            .from("recommendation_runs")
            .select("id")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        const { data, error } = authUser
            ? await db
                .from("recommendation_runs")
                .select("id")
                .eq("user_id", authUser.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle()
            : await db
                .from("recommendation_runs")
                .select("id")
                .eq("session_id", sessionId!)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (error) {
            console.error("[/api/recommendations/latest] DB error:", error);
            return NextResponse.json({ runId: null }, { status: 200 });
        }

        return NextResponse.json(
            { runId: data?.id ?? null },
            {
                status: 200,
                headers: {
                    "Cache-Control": "private, max-age=10, stale-while-revalidate=5",
                },
            }
        );
    } catch (err) {
        console.error("[/api/recommendations/latest] Unhandled error:", err);
        return NextResponse.json({ runId: null }, { status: 200 });
    }
}
