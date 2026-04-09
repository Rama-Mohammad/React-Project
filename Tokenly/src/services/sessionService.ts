import { supabase } from "../lib/supabaseClient";
import type { SessionStatus } from "../types/session";

export async function createSession(data: {
  request_id: string;
  offer_id: string;
  helper_id: string;
  requester_id: string;
  scheduled_at?: string;
  duration_minutes?: number;
}) {
  return await supabase
    .from("sessions")
    .insert({ ...data, status: "upcoming" })
    .select()
    .single();
}

export async function getSessionById(id: string) {
  return await supabase
    .from("sessions")
    .select("*, request:requests(*), helper:profiles!helper_id(*), requester:profiles!requester_id(*)")
    .eq("id", id)
    .single();
}

export async function getSessionsByUser(user_id: string) {
  return await supabase
    .from("sessions")
    .select(`
      *,
      request:requests(*),
      helper:profiles!helper_id(*),
      requester:profiles!requester_id(*)
    `)
    .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`)
    .order("scheduled_at", { ascending: false });
}

export async function getSessionsByStatus(user_id: string, status: SessionStatus) {
  return await supabase
    .from("sessions")
    .select(`
      *,
      request:requests(*),
      helper:profiles!helper_id(*),
      requester:profiles!requester_id(*)
    `)
    .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`)
    .eq("status", status)
    .order("scheduled_at", { ascending: true });
}

export async function updateSessionStatus(id: string, status: SessionStatus) {
  const updates: Record<string, unknown> = { status };
  if (status === "completed") updates.completed_at = new Date().toISOString();

  return await supabase
    .from("sessions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
}