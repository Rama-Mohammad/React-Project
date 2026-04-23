import { supabase } from "../lib/supabaseClient";
import type { DirectRequest, DirectRequestInput } from "../types/directRequest";
import { createNotification } from "./notificationService";
import { ensureSessionForBooking, validateSessionScheduleAvailability } from "./sessionService";

export async function sendDirectRequest(data: DirectRequestInput) {
  const { data: created, error } = await supabase
    .from("direct_requests")
    .insert({ ...data, status: "pending" })
    .select()
    .single();

  if (error || !created) return { data: null, error };

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

  const availabilityResult = await validateSessionScheduleAvailability({
    helper_id: dr.helper_id,
    requester_id: dr.requester_id,
    duration_minutes: dr.duration_minutes,
    scheduled_at: scheduledAt,
  });

  if (availabilityResult.error) return { data: null, error: availabilityResult.error };

  const { error: acceptError } = await supabase
    .from("direct_requests")
    .update({ status: "accepted" })
    .eq("id", directRequestId);

  if (acceptError) return { data: null, error: acceptError };

  const { data: session, error: sessionError } = await ensureSessionForBooking({
    helper_id: dr.helper_id,
    requester_id: dr.requester_id,
    direct_request_id: directRequestId,
    duration_minutes: dr.duration_minutes,
    scheduled_at: scheduledAt,
  });

  if (sessionError) return { data: null, error: sessionError };

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


