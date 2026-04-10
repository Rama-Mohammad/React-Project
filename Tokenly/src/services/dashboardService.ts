import { supabase } from "../lib/supabaseClient";

export async function getDashboardProfile(user_id: string) {
  return await supabase
    .from("profiles")
    .select("full_name, credit_balance, avg_rating, profile_image_url, username")
    .eq("id", user_id)
    .single();
}

export async function getDashboardStats(user_id: string) {
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
  return await supabase
    .from("sessions")
    .select(`
      id,
      status,
      scheduled_at,
      duration_minutes,
      helper_id,
      requester_id,
      request:requests(id, title, category),
      helper:profiles!sessions_helper_id_fkey(id, full_name),
      requester:profiles!sessions_requester_id_fkey(id, full_name)
    `)
    .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`)
    .order("scheduled_at", { ascending: false })
    .limit(20);
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