import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Returns a Supabase client configured with the service role key.
 * This client bypasses RLS and must only be used server-side.
 */
export function getSupabaseServer(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars"
    );
  }

  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return _client;
}
