import { supabase } from "../lib/supabaseClient";
import type {
  ExploreHelpOfferRow,
  ExploreProfileRow,
  ExploreSessionRow,
  ExploreSkillRow,
} from "../types/explore";

export async function getExploreHelpers() {
  const { data: skillUserIds, error: skillIdsError } = await supabase
    .from("skills")
    .select("user_id");

  const { data: helpOfferUserIds, error: helpOfferIdsError } = await supabase
    .from("help_offers")
    .select("helper_id")
    .eq("status", "open");

  if (skillIdsError || helpOfferIdsError) {
    return { data: null, error: skillIdsError ?? helpOfferIdsError };
  }

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
    .in("id", helperIds)
    .limit(50);

  if (profilesError) return { data: null, error: profilesError };

  const [
    { data: skills, error: skillsError },
    { data: sessions, error: sessionsError },
    { data: helpOffers, error: helpOffersError },
  ] = await Promise.all([
    supabase
      .from("skills")
      .select("id, user_id, name, category, level, sessions_count")
      .in("user_id", helperIds)
      .limit(200),
    supabase
      .from("sessions")
      .select("id, helper_id, status")
      .in("helper_id", helperIds)
      .limit(500),
    supabase
      .from("help_offers")
      .select("id, helper_id, category, credit_cost, duration_minutes, status")
      .in("helper_id", helperIds)
      .limit(200),
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
