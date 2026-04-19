import { supabase } from "../lib/supabaseClient";
import type { DirectRequest, DirectRequestInput } from "../types/directRequest";
import { createNotification } from "./notificationService";
import { ensureSessionForBooking } from "./sessionService";

// User sends a private session request to a specific helper
export async function sendDirectRequest(data: DirectRequestInput) {
  const { data: created, error } = await supabase
    .from("direct_requests")
    .insert({ ...data, status: "pending" })
    .select()
    .single();

  if (error || !created) return { data: null, error };

  // Notify the helper
  await createNotification({
    user_id: data.helper_id,
    type: "direct_request_received",
    title: "Someone requested you directly",
    message: `You have a new direct session request: "${data.title}"`,
    related_id: created.id,
    related_type: "direct_request",
  });

  return { data: created as DirectRequest, error: null };
}

// Fetch all direct requests a user has sent
export async function getSentDirectRequests(requester_id: string) {
  return await supabase
    .from("direct_requests")
    .select(`
      id,
      requester_id,
      helper_id,
      title,
      message,
      category,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      helper:profiles!direct_requests_helper_id_fkey(
        id,
        full_name,
        username,
        profile_image_url,
        avg_rating
      )
    `)
    .eq("requester_id", requester_id)
    .order("created_at", { ascending: false });
}

// Fetch all direct requests a helper has received
export async function getReceivedDirectRequests(helper_id: string) {
  return await supabase
    .from("direct_requests")
    .select(`
      id,
      requester_id,
      helper_id,
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
        profile_image_url,
        avg_rating
      )
    `)
    .eq("helper_id", helper_id)
    .order("created_at", { ascending: false });
}

// Helper accepts → session is created with direct_request_id (Flow 3)
export async function acceptDirectRequest(
  directRequestId: string,
  scheduledAt?: string
) {
  const { data: dr, error: fetchError } = await supabase
    .from("direct_requests")
    .select("requester_id, helper_id, duration_minutes, credit_cost, title")
    .eq("id", directRequestId)
    .single();

  if (fetchError || !dr) return { data: null, error: fetchError };

  // Mark as accepted
  const { error: acceptError } = await supabase
    .from("direct_requests")
    .update({ status: "accepted" })
    .eq("id", directRequestId);

  if (acceptError) return { data: null, error: acceptError };

  // Create or refresh the session — store direct_request_id (Flow 3)
  const { data: session, error: sessionError } = await ensureSessionForBooking({
    helper_id: dr.helper_id,
    requester_id: dr.requester_id,
    direct_request_id: directRequestId,
    duration_minutes: dr.duration_minutes,
    scheduled_at: scheduledAt,
  });

  if (sessionError) return { data: null, error: sessionError };

  // Notify the requester
  await createNotification({
    user_id: dr.requester_id,
    type: "direct_request_accepted",
    title: "Your direct request was accepted",
    message: `Your session request "${dr.title}" has been accepted`,
    related_id: session.id,
    related_type: "session",
  });

  return { data: session, error: null };
}

export async function rejectDirectRequest(directRequestId: string) {
  const { data: dr, error: fetchError } = await supabase
    .from("direct_requests")
    .select("requester_id, title")
    .eq("id", directRequestId)
    .single();

  if (fetchError) return { error: fetchError };

  const { error } = await supabase
    .from("direct_requests")
    .update({ status: "rejected" })
    .eq("id", directRequestId);

  if (!error && dr?.requester_id) {
    await createNotification({
      user_id: dr.requester_id,
      type: "direct_request_rejected",
      title: "Your direct request was declined",
      message: `The helper declined your session request "${dr.title}"`,
      related_id: directRequestId,
      related_type: "direct_request",
    });
  }

  return { error };
}

export async function cancelDirectRequest(directRequestId: string) {
  return await supabase
    .from("direct_requests")
    .update({ status: "cancelled" })
    .eq("id", directRequestId);
}
