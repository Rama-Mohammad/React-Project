import { supabase } from "../lib/supabaseClient";
// import { getSessionsAuthDebugContext, logSessionsQuery } from "./sessionDebug";

export type ExploreProfileRow = {
  id: string;
  full_name: string | null;
  username: string | null;
  avg_rating: number | null;
  title: string | null;
  bio: string | null;
  profile_image_url: string | null;
};

export type ExploreSkillRow = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  level: string;
  sessions_count: number;
};

export type ExploreSessionRow = {
  id: string;
  helper_id: string;
  status: string;
};

export type ExploreHelpOfferRow = {
  id: string;
  helper_id: string;
  credit_cost: number | null;
  duration_minutes: number | null;
  status: string;
};

export async function getExploreHelpers() {
  // Fetch IDs of profiles that have skills
  const { data: skillUserIds, error: skillIdsError } = await supabase
    .from("skills")
    .select("user_id");

  // Fetch IDs of profiles that have open help_offers
  const { data: helpOfferUserIds, error: helpOfferIdsError } = await supabase
    .from("help_offers")
    .select("helper_id")
    .eq("status", "open");

  if (skillIdsError || helpOfferIdsError) {
    return { data: null, error: skillIdsError ?? helpOfferIdsError };
  }

  // Union the two sets of IDs
  const helperIdSet = new Set([
    ...(skillUserIds ?? []).map((r) => r.user_id),
    ...(helpOfferUserIds ?? []).map((r) => r.helper_id),
  ]);

  const helperIds = Array.from(helperIdSet).filter(Boolean) as string[];

  if (helperIds.length === 0) {
    return {
      data: {
        profiles: [] as ExploreProfileRow[],
        skills: [] as ExploreSkillRow[],
        sessions: [] as ExploreSessionRow[],
        helpOffers: [] as ExploreHelpOfferRow[],
      },
      error: null,
    };
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, username, avg_rating, title, bio, profile_image_url, last_seen")
    .in("id", helperIds);

  if (profilesError) return { data: null, error: profilesError };

  const [
    { data: skills, error: skillsError },
    { data: sessions, error: sessionsError },
    { data: helpOffers, error: helpOffersError },
  ] = await Promise.all([
    supabase
      .from("skills")
      .select("id, user_id, name, category, level, sessions_count")
      .in("user_id", helperIds),
    supabase
      .from("sessions")
      .select("id, helper_id, status")
      .in("helper_id", helperIds),
    supabase
      .from("help_offers")
      .select("id, helper_id, credit_cost, duration_minutes, status")
      .in("helper_id", helperIds),
  ]);

  const error = skillsError ?? sessionsError ?? helpOffersError;
  if (error) return { data: null, error };

  return {
    data: {
      profiles: (profiles ?? []) as ExploreProfileRow[],
      skills: (skills ?? []) as ExploreSkillRow[],
      sessions: (sessions ?? []) as ExploreSessionRow[],
      helpOffers: (helpOffers ?? []) as ExploreHelpOfferRow[],
    },
    error: null,
  };
}