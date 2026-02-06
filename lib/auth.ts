import { supabase } from "./supabase";
import { createServerSupabaseClient } from "./supabase";

export async function getCurrentUser() {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getServerUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error("Error getting server user:", err);
    return null;
  }
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  window.location.href = "/";
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

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

export async function signInWithGoogle() {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function getUserFromRequest(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Error getting user from request:", err);
    return null;
  }
}
