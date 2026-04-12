import { supabase } from "../lib/supabaseClient";
import { getSessionsAuthDebugContext, logSessionsQuery } from "./sessionDebug";

export async function getDashboardProfile(user_id: string) {
  return await supabase
    .from("profiles")
    .select("full_name, credit_balance, avg_rating, profile_image_url, username")
    .eq("id", user_id)
    .single();
}

export async function getDashboardStats(user_id: string) {
  const { session, user, authError } = await getSessionsAuthDebugContext();
  logSessionsQuery("getDashboardStats sessions query start", {
    session,
    user,
    payload: {
      user_id,
      filter: `.or(helper_id.eq.${user_id},requester_id.eq.${user_id})`,
      select: "id, status, helper_id, requester_id",
    },
    error: authError,
  });

  const [sessionsRes, requestsRes, offersRes] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, status, helper_id, requester_id")
      .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`),

    supabase
      .from("requests")
      .select("id")
      .eq("requester_id", user_id),

    supabase
      .from("offers")
      .select("id, status")
      .eq("helper_id", user_id),
  ]);

  logSessionsQuery("getDashboardStats sessions query result", {
    session,
    user,
    payload: {
      user_id,
      filter: `.or(helper_id.eq.${user_id},requester_id.eq.${user_id})`,
      select: "id, status, helper_id, requester_id",
    },
    error: authError ?? sessionsRes.error,
  });

  const sessions = sessionsRes.data ?? [];
  const requests = requestsRes.data ?? [];
  const offers = offersRes.data ?? [];

  const completedSessions = sessions.filter((s) => s.status === "completed");

  return {
    completedSessions: completedSessions.length,
    upcomingSessions: sessions.filter((s) => s.status === "upcoming").length,
    totalHelpGiven: completedSessions.filter((s) => s.helper_id === user_id).length,
    totalHelpReceived: completedSessions.filter((s) => s.requester_id === user_id).length,
    activeRequests: requests.length,
    offersSubmitted: offers.length,
    offersAccepted: offers.filter((o) => o.status === "accepted").length,
  };
}

export async function getDashboardSessions(user_id: string) {
  const { session, user, authError } = await getSessionsAuthDebugContext();
  const payload = {
    user_id,
    filter: `.or(helper_id.eq.${user_id},requester_id.eq.${user_id})`,
    limit: 20,
  };

  logSessionsQuery("getDashboardSessions start", { session, user, payload, error: authError });
  if (authError) {
    return { data: null, error: authError };
  }

  const result = await supabase
    .from("sessions")
    .select(`
      id,
      status,
      scheduled_at,
      duration_minutes,
      helper_id,
      requester_id,
      request_id,
      help_offer_request_id,
      direct_request_id,
      request:requests(id, title, category),
      help_offer_request:help_offer_requests!sessions_help_offer_request_id_fkey(
        id,
        help_offer:help_offers!help_offer_requests_help_offer_id_fkey(
          id,
          title,
          category
        )
      ),
      direct_request:direct_requests!sessions_direct_request_id_fkey(
        id,
        title,
        category
      ),
      helper:profiles!sessions_helper_id_fkey(id, full_name),
      requester:profiles!sessions_requester_id_fkey(id, full_name)
    `)
    .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`)
    .order("scheduled_at", { ascending: true, nullsFirst: false })
    .limit(20);
  logSessionsQuery("getDashboardSessions result", { session, user, payload, error: result.error });
  return result;
}

export async function getDashboardOffers(user_id: string) {
  return await supabase
    .from("offers")
    .select(`
      id,
      status,
      created_at,
      request:requests(id, title, credit_cost, requester:profiles!requests_requester_id_fkey(full_name))
    `)
    .eq("helper_id", user_id)
    .order("created_at", { ascending: false })
    .limit(10);
}

//to get direct requests 
export async function getDashboardDirectRequests(helper_id: string) {
  return await supabase
    .from("direct_requests")
    .select(`
      id,
      helper_id,
      requester_id,
      title,
      message,
      category,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      requester:profiles!direct_requests_requester_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      ),
      helper:profiles!direct_requests_helper_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      )
    `)
    .eq("helper_id", helper_id)
    .order("created_at", { ascending: false })
    .limit(10);
}

export async function getDashboardSentDirectRequests(requester_id: string) {
  return await supabase
    .from("direct_requests")
    .select(`
      id,
      helper_id,
      requester_id,
      title,
      message,
      category,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      requester:profiles!direct_requests_requester_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      ),
      helper:profiles!direct_requests_helper_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      )
    `)
    .eq("requester_id", requester_id)
    .order("created_at", { ascending: false })
    .limit(10);
}
