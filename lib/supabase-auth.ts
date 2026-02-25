import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Returns a Supabase client wired to the request cookies.
 * Use in Server Components, Route Handlers, and Server Actions.
 *
 * This client uses the **anon key** and honours RLS.
 * For admin / service-role access, use `getSupabaseServer()` from
 * `lib/supabase-server.ts` instead.
 */
export async function getSupabaseAuth() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars");
  }

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` is called from Server Components where cookies
            // cannot be modified. This is safe to ignore — the middleware
            // will refresh the session before the page renders.
          }
        },
      },
    }
  );
}
