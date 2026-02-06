import { supabase } from "./supabase";
import { createServerSupabaseClient } from "./supabase";

// CLIENT-ONLY: Get current user from browser session
export async function getCurrentUser() {
  if (typeof window === "undefined") return null;
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// SERVER-ONLY: Get user from server session (cookies)
export async function getServerUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error("Error getting server user:", err instanceof Error ? err.message : "Unknown error");
    return null;
  }
}

// CLIENT-ONLY: Sign out
export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  window.location.href = "/";
}

// CLIENT-ONLY: Sign in with email
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// CLIENT-ONLY: Sign up with email
export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "",
      },
    },
  });

  if (error) throw error;
  return data;
}

// CLIENT-ONLY: Sign in with Google
// Note: Ensure /api/auth/callback is added to Supabase OAuth allowed redirect URLs
export async function signInWithGoogle() {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

// SERVER-ONLY: Get user from API request Authorization header
export async function getUserFromRequest(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const supabase = await createServerSupabaseClient();
    
    // Set the session using the token, then get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Error getting user from request:", err instanceof Error ? err.message : "Unknown error");
    return null;
  }
}
