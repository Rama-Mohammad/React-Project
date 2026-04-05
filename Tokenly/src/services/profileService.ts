import { supabase } from "../lib/supabaseClient";

export async function getProfileById(id: string) {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
}

export async function getProfileByUsername(username: string) {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
}

export async function updateProfile(
  id: string,
  updates: {
    username?: string;
    full_name?: string;
    bio?: string;
    profile_image_url?: string;
  }
) {
  return await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
}

export async function searchProfiles(query: string) {
  return await supabase
    .from("profiles")
    .select("*")
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .order("avg_rating", { ascending: false });
}

export async function getEmailByUsername(username: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", username)
    .maybeSingle();

  if (error || !data) return null;
  return data.email;   
}