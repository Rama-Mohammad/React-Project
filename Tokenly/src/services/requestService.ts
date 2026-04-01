import { supabase } from "../lib/supabaseClient";
import type { RequestStatus, Urgency } from "../types/request";

export async function createRequest(data: {
  requester_id: string;
  title: string;
  description: string;
  category?: string;
  urgency: Urgency;
  duration_minutes?: number;
  credit_cost: number;
  tags?: string[];
}) {
  return await supabase
    .from("requests")
    .insert(data)
    .select()
    .single();
}

export async function getRequestById(id: string) {
  return await supabase
    .from("requests")
    .select("*, requester:profiles(*), offers(*)")
    .eq("id", id)
    .single();
}

export async function getRequestsByUser(requester_id: string) {
  return await supabase
    .from("requests")
    .select("*")
    .eq("requester_id", requester_id)
    .order("created_at", { ascending: false });
}

export async function getAllOpenRequests(filters?: {
  category?: string;
  urgency?: Urgency;
  max_duration?: number;
}) {
  let query = supabase
    .from("requests")
    .select("*, requester:profiles(*)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.urgency) query = query.eq("urgency", filters.urgency);
  if (filters?.max_duration)
    query = query.lte("duration_minutes", filters.max_duration);

  return await query;
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  return await supabase
    .from("requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteRequest(id: string) {
  return await supabase.from("requests").delete().eq("id", id);
}