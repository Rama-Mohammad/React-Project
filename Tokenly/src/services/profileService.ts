import { supabase } from "../lib/supabaseClient";

export async function getProfileById(id: string) {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
}

export async function getProfileCreditBalance(id: string) {
  return await supabase
    .from("profiles")
    .select("credit_balance")
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
    cover_image_url?: string;
    title?: string;
    institution?: string;
    location?: string;
    website?: string;
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

/**
uploads a profile picture to the `profile-pics` bucket and returns the public URL.
path: profile-pics/{userId}/{timestamp}.{ext}**/

export async function uploadProfilePicture(
  userId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-pics")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return null;

  const { data } = supabase.storage.from("profile-pics").getPublicUrl(path);
  return data.publicUrl ?? null;
}

export async function updateLastSeen(user_id: string) {
  return await supabase
    .from("profiles")
    .update({ last_seen: new Date().toISOString() })
    .eq("id", user_id);
}


export async function getPublicHelperProfileCore(helper_id: string) {
  const [profileRes, skillsRes, reviewsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, username, bio, profile_image_url, cover_image_url, avg_rating, credit_balance, created_at, title, institution, location, website, last_seen")
      .eq("id", helper_id)
      .single(),
    supabase
      .from("skills")
      .select("id, name, category, level, sessions_count, description")
      .eq("user_id", helper_id)
      .order("sessions_count", { ascending: false }),
    supabase
      .from("reviews")
      .select("id, rating, comment, created_at, reviewer:profiles!reviews_reviewer_id_fkey(full_name, username)")
      .eq("reviewee_id", helper_id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    profile: profileRes.data ?? null,
    skills: skillsRes.data ?? [],
    reviews: reviewsRes.data ?? [],
    error: profileRes.error ?? skillsRes.error ?? reviewsRes.error ?? null,
  };
}

export async function getHelperOpenOffers(helper_id: string) {
  return await supabase
    .from("help_offers")
    .select("id, title, description, category, urgency, duration_minutes, credit_cost, status, created_at")
    .eq("helper_id", helper_id)
    .eq("status", "open")
    .order("created_at", { ascending: false });
}