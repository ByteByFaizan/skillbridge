import { createBrowserClient } from "@supabase/ssr";

// Best practice (client-swr-dedup): deduplicate client creation
let _client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton Supabase client for use in Client Components.
 * Uses the anon key — respects RLS policies.
 */
export function getSupabaseBrowser() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars");
  }

  _client = createBrowserClient(url, anonKey);

  return _client;
}
