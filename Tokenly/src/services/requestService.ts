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
  status?: RequestStatus;
}) {
  const payload = {
    requester_id: data.requester_id,
    title: data.title,
    description: data.description,
    category: data.category,
    urgency: data.urgency,
    duration_minutes: data.duration_minutes,
    credit_cost: data.credit_cost,
    status: data.status ?? "open",
  };

  return await supabase
    .from("requests")
    .insert(payload)
    .select()
    .single();
}

export async function getRequestById(id: string) {
  return await supabase
    .from("requests")
    .select(`
      id,
      requester_id,
      title,
      description,
      category,
      urgency,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      requester:profiles (
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      ),
      offers (
        id
      ),
      request_skills (
        skill:skills (
          name
        )
      )
    `)
    .eq("id", id)
    .single();
}

export async function getRequestsByUser(requester_id: string) {
  return await supabase
    .from("requests")
    .select("id, requester_id, title, description, category, urgency, duration_minutes, credit_cost, status, created_at")
    .eq("requester_id", requester_id)
    .order("created_at", { ascending: false });
}

export async function getAllOpenRequests(filters?: {
  category?: string;
  urgency?: Urgency;
  max_duration?: number;
  page?: number;
  pageSize?: number;
}) {
  let query = supabase
    .from("requests")
    .select(`
      id,
      requester_id,
      title,
      description,
      category,
      urgency,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      requester:profiles (
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      ),
      offers (
        id
      ),
      request_skills (
        skill:skills (
          name
        )
      )
    `, { count: "exact" })
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.urgency) query = query.eq("urgency", filters.urgency);
  if (filters?.max_duration) {
    query = query.lte("duration_minutes", filters.max_duration);
  }
  if (typeof filters?.page === "number" && typeof filters?.pageSize === "number") {
    const from = filters.page * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
  }

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

export async function deleteRequest(id: string, requesterId?: string) {
  let query = supabase.from("requests").delete().eq("id", id);

  if (requesterId) {
    query = query.eq("requester_id", requesterId);
  }

  return await query;
}
