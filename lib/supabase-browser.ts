import { createBrowserClient } from "@supabase/ssr";

// Best practice (client-swr-dedup): deduplicate client creation
let _client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton Supabase client for use in Client Components.
 * Uses the anon key — respects RLS policies.
 */
export function getSupabaseBrowser() {
  if (_client) return _client;

  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return _client;
}
