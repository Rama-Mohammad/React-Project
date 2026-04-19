import { supabase } from "../lib/supabaseClient";
import { getSessionsAuthDebugContext, logSessionsQuery } from "./sessionDebug";


// -------------------------
// PROFILE
// -------------------------
export async function getDashboardProfile(user_id: string) {
  return await supabase
    .from("profiles")
    .select("full_name, credit_balance, avg_rating, profile_image_url, username")
    .eq("id", user_id)
    .single();
}


// -------------------------
// STATS (OPTIMIZED - NO HEAVY DATA FETCH)
// -------------------------
export async function getDashboardStats(user_id: string) {
  const { session, user, authError } = await getSessionsAuthDebugContext();

  logSessionsQuery("getDashboardStats start", {
    session,
    user,
    payload: { user_id },
    error: authError,
  });

  if (authError) {
    return {
      completedSessions: 0,
      upcomingSessions: 0,
      totalHelpGiven: 0,
      totalHelpReceived: 0,
      activeRequests: 0,
      offersSubmitted: 0,
      offersAccepted: 0,
    };
  }

  const [
    completedSessions,
    upcomingSessions,
    helpGiven,
    helpReceived,
    requestsCount,
    offersSubmitted,
    offersAccepted,
  ] = await Promise.all([
    supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")
      .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`),

    supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "upcoming")
      .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`),

    supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")
      .eq("helper_id", user_id),

    supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")
      .eq("requester_id", user_id),

    supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("requester_id", user_id),

    supabase
      .from("offers")
      .select("*", { count: "exact", head: true })
      .eq("helper_id", user_id),

    supabase
      .from("offers")
      .select("*", { count: "exact", head: true })
      .eq("helper_id", user_id)
      .eq("status", "accepted"),
  ]);

  return {
    completedSessions: completedSessions.count ?? 0,
    upcomingSessions: upcomingSessions.count ?? 0,
    totalHelpGiven: helpGiven.count ?? 0,
    totalHelpReceived: helpReceived.count ?? 0,
    activeRequests: requestsCount.count ?? 0,
    offersSubmitted: offersSubmitted.count ?? 0,
    offersAccepted: offersAccepted.count ?? 0,
  };
}


// -------------------------
// SESSIONS (LIGHTWEIGHT)
// -------------------------
export async function getDashboardSessions(user_id: string) {
  return await supabase
    .from("sessions")
    .select(`
      id,
      status,
      scheduled_at,
      duration_minutes
    `)
    .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`)
    .order("scheduled_at", { ascending: true })
    .limit(20);
}


// -------------------------
// SESSION DETAILS (NO "*")
// -------------------------
export async function getSessionDetails(session_id: string) {
  return await supabase
    .from("sessions")
    .select(`
      id,
      status,
      scheduled_at,
      duration_minutes,
      created_at,
      request:requests(
        id,
        title
      ),
      helper:profiles(
        id,
        full_name,
        profile_image_url
      ),
      requester:profiles(
        id,
        full_name,
        profile_image_url
      )
    `)
    .eq("id", session_id)
    .single();
}


// -------------------------
// DASHBOARD DATA BATCH (SAFE)
// -------------------------
export async function getDashboardData(user_id: string) {
  const results = await Promise.allSettled([
    getDashboardProfile(user_id),
    getDashboardStats(user_id),
    getDashboardSessions(user_id),
    getDashboardOffers(user_id),
    getDashboardDirectRequests(user_id),
    getDashboardSentDirectRequests(user_id),
    getDashboardHelpOfferRequests(user_id),
  ]);

  return results.map((r) =>
    r.status === "fulfilled" ? r.value : null
  );
}


// -------------------------
// OFFERS
// -------------------------
export async function getDashboardOffers(user_id: string) {
  return await supabase
    .from("offers")
    .select(`
      id,
      status,
      created_at,
      request_id
    `)
    .eq("helper_id", user_id)
    .order("created_at", { ascending: false })
    .limit(10);
}


// -------------------------
// DIRECT REQUESTS (RECEIVED)
// -------------------------
export async function getDashboardDirectRequests(helper_id: string) {
  return await supabase
    .from("direct_requests")
    .select(`
      id,
      title,
      message,
      category,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      requester:profiles(
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


// -------------------------
// DIRECT REQUESTS (SENT)
// -------------------------
export async function getDashboardSentDirectRequests(requester_id: string) {
  return await supabase
    .from("direct_requests")
    .select(`
      id,
      title,
      message,
      category,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      helper:profiles(
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


// -------------------------
// HELP OFFER REQUESTS
// -------------------------
export async function getDashboardHelpOfferRequests(helper_id: string) {
  return await supabase
    .from("help_offer_requests")
    .select(`
      id,
      message,
      status,
      created_at,
      requester:profiles(
        id,
        full_name,
        username,
        profile_image_url
      ),
      help_offer:help_offers(
        id,
        title,
        credit_cost,
        duration_minutes,
        helper_id
      )
    `)
    .eq("status", "pending")
    .eq("help_offers.helper_id", helper_id)
    .order("created_at", { ascending: false })
    .limit(10);
}