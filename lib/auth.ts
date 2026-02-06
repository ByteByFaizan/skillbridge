import { supabase } from "./supabase";

export async function getCurrentUser() {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
