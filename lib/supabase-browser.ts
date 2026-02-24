import { createBrowserClient } from "@supabase/ssr";

/**
 * Returns a Supabase client for use in Client Components.
 * Uses the anon key — respects RLS policies.
 */
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
