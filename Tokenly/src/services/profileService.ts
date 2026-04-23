import { supabase } from "../lib/supabaseClient";

const PROFILE_IDENTIFIER_CACHE = new Map<string, { id: string; username?: string | null }>();

export async function getProfileById(id: string) {
  return await supabase
    .from("profiles")
    .select("id, full_name, username, bio, title, institution, location, website, avg_rating, credit_balance, profile_image_url, cover_image_url, last_seen, created_at")
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

export async function getProfileCompletedSessionsCount(id: string) {
  const { count, error } = await supabase
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("helper_id", id)
    .eq("status", "completed");

  return {
    count: count ?? 0,
    error,
  };
}

export async function getProfileByUsername(username: string) {
  return await supabase
    .from("profiles")
    .select("id, full_name, username, bio, title, institution, location, website, avg_rating, credit_balance, profile_image_url, cover_image_url, last_seen, created_at")
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
    .select("id, full_name, username, avg_rating, profile_image_url, title")
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

export async function getPublicProfileBasic(
  helper_id: string,
  options?: { includePrivate?: boolean }
) {
  const profileColumns = options?.includePrivate
    ? "id, full_name, username, bio, profile_image_url, cover_image_url, avg_rating, credit_balance, created_at, title, institution, location, website"
    : "id, full_name, username, bio, profile_image_url, cover_image_url, avg_rating, created_at, title, institution, location, website";

  return await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", helper_id)
    .single();
}

export async function getPublicProfileDetails(helper_id: string) {
  const [skillsRes, reviewsRes] = await Promise.all([
    supabase
      .from("skills")
      .select("id, name, category, level, sessions_count, description")
      .eq("user_id", helper_id)
      .order("sessions_count", { ascending: false }),
    supabase
      .from("reviews")
      .select("id, rating, comment, created_at, reviewer:profiles!reviews_reviewer_id_fkey(full_name, username, profile_image_url)")
      .eq("reviewee_id", helper_id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    skills: skillsRes.data ?? [],
    reviews: reviewsRes.data ?? [],
    error: skillsRes.error ?? reviewsRes.error ?? null,
  };
}

export async function getPublicHelperProfileCore(
  helper_id: string,
  options?: { includePrivate?: boolean }
) {
  const [profileRes, detailsRes] = await Promise.all([
    getPublicProfileBasic(helper_id, options),
    getPublicProfileDetails(helper_id),
  ]);

  return {
    profile: profileRes.data ?? null,
    skills: detailsRes.skills,
    reviews: detailsRes.reviews,
    error: profileRes.error ?? detailsRes.error ?? null,
  };
}

export async function getHelperOpenOffers(
  helper_id: string,
  options?: { limit?: number }
) {
  let query = supabase
    .from("help_offers")
    .select("id, title, description, category, urgency, duration_minutes, credit_cost, status, created_at")
    .eq("helper_id", helper_id)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (typeof options?.limit === "number" && options.limit > 0) {
    query = query.limit(options.limit);
  }

  return await query;
}

export async function resolvePublicProfileIdentifier(identifier: string) {
  const normalized = identifier.trim();
  if (!normalized) {
    return { data: null, error: { message: "Profile identifier is required." } };
  }

  const cacheKey = normalized.toLowerCase();
  const cached = PROFILE_IDENTIFIER_CACHE.get(cacheKey);
  if (cached) {
    return { data: cached, error: null };
  }

  const identifierColumns = "id, username";
  const looksLikeUuid = normalized.includes("-");
  if (looksLikeUuid) {
    const directMatch = { id: normalized, username: null };
    PROFILE_IDENTIFIER_CACHE.set(cacheKey, directMatch);
    return { data: directMatch, error: null };
  }

  const primaryLookup = looksLikeUuid
    ? await supabase.from("profiles").select(identifierColumns).eq("id", normalized).single()
    : await supabase.from("profiles").select(identifierColumns).eq("username", normalized.toLowerCase()).single();

  if (primaryLookup.data) {
    PROFILE_IDENTIFIER_CACHE.set(cacheKey, primaryLookup.data);
    return { data: primaryLookup.data, error: null };
  }

  const fallbackLookup = looksLikeUuid
    ? await supabase.from("profiles").select(identifierColumns).eq("username", normalized.toLowerCase()).single()
    : await supabase.from("profiles").select(identifierColumns).eq("id", normalized).single();

  return {
    data: fallbackLookup.data ?? null,
    error: fallbackLookup.error ?? primaryLookup.error,
  };
}


