import { supabase } from "../lib/supabaseClient";
import type {
  HelpOfferInput,
  HelpOfferUpdateInput,
  HelpOfferRequest,
  HelpOfferRequestInput,
} from "../types/helpOffer";
import { createNotification } from "./notificationService";
import { getProfileCreditBalance } from "./profileService";
import { ensureSessionForBooking } from "./sessionService";

// ─── HELP OFFERS ────────────────────────────────────────────────────────────

// Used by the Offers tab in Explore — fetches all open help_offers with helper
// profile and linked skill names
export async function getOpenHelpOffers(opts?: { page?: number; pageSize?: number }) {
  let query = supabase
    .from("help_offers")
    .select(`
      id,
      helper_id,
      title,
      description,
      category,
      urgency,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      helper:profiles!help_offers_helper_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      ),
      skills:help_offer_skills(
        skill:skills(name)
      )
    `, { count: "exact" })
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (typeof opts?.page === "number" && typeof opts?.pageSize === "number") {
    const from = opts.page * opts.pageSize;
    const to = from + opts.pageSize - 1;
    query = query.range(from, to);
  }

  return await query;
}

// Used by a helper's own profile/dashboard to see their posted offers
export async function getHelpOffersByHelper(helper_id: string) {
  return await supabase
    .from("help_offers")
    .select(`
      id,
      helper_id,
      title,
      description,
      category,
      urgency,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      skills:help_offer_skills(
        skill:skills(name)
      )
    `)
    .eq("helper_id", helper_id)
    .order("created_at", { ascending: false });
}

export async function getHelpOfferById(id: string) {
  return await supabase
    .from("help_offers")
    .select(`
      id,
      helper_id,
      title,
      description,
      category,
      urgency,
      duration_minutes,
      credit_cost,
      status,
      created_at,
      helper:profiles!help_offers_helper_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      ),
      skills:help_offer_skills(
        skill:skills(name)
      )
    `)
    .eq("id", id)
    .maybeSingle();
}

export async function createHelpOffer(data: HelpOfferInput) {
  return await supabase
    .from("help_offers")
    .insert({ ...data, status: "open" })
    .select()
    .single();
}

export async function updateHelpOffer(id: string, updates: HelpOfferUpdateInput) {
  return await supabase
    .from("help_offers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
}

export async function deleteHelpOffer(id: string) {
  return await supabase
    .from("help_offers")
    .delete()
    .eq("id", id);
}

// ─── HELP OFFER REQUESTS ─────────────────────────────────────────────────────

// Fetch all requests that came in for a specific help_offer
// Used by the helper to see who wants their offer
export async function getRequestsForHelpOffer(help_offer_id: string) {
  return await supabase
    .from("help_offer_requests")
    .select(`
      id,
      help_offer_id,
      requester_id,
      message,
      status,
      created_at,
      requester:profiles!help_offer_requests_requester_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      )
    `)
    .eq("help_offer_id", help_offer_id)
    .order("created_at", { ascending: false });
}

// Fetch all help_offer_requests a user has sent (from their side)
export async function getHelpOfferRequestsByUser(requester_id: string) {
  return await supabase
    .from("help_offer_requests")
    .select(`
      id,
      help_offer_id,
      requester_id,
      message,
      status,
      created_at,
      help_offer:help_offers!help_offer_requests_help_offer_id_fkey(
        id,
        title,
        category,
        credit_cost,
        duration_minutes,
        helper_id,
        helper:profiles!help_offers_helper_id_fkey(
          full_name,
          username,
          profile_image_url
        )
      )
    `)
    .eq("requester_id", requester_id)
    .order("created_at", { ascending: false });
}

// User submits a request to a helper's help_offer
// This replaces the old hack in OfferAppointment that created fake requests+offers
export async function submitHelpOfferRequest(data: HelpOfferRequestInput) {
  const { data: helpOfferForValidation, error: helpOfferError } = await supabase
    .from("help_offers")
    .select("id, helper_id, title, credit_cost, status")
    .eq("id", data.help_offer_id)
    .single();

  if (helpOfferError || !helpOfferForValidation) {
    return { data: null, error: helpOfferError ?? new Error("Help offer not found.") };
  }

  if (helpOfferForValidation.status !== "open") {
    return { data: null, error: new Error("This offer is no longer available.") };
  }

  const { data: profileData, error: profileError } = await getProfileCreditBalance(data.requester_id);
  if (profileError) {
    return { data: null, error: new Error(profileError.message ?? "Could not verify your token balance.") };
  }

  const currentBalance = Number(profileData?.credit_balance ?? 0);
  const requiredCredits = Number(helpOfferForValidation.credit_cost ?? 0);
  if (currentBalance < requiredCredits) {
    return {
      data: null,
      error: new Error(`You need ${requiredCredits} tokens to book this offer, but you only have ${currentBalance}.`),
    };
  }

  const { data: created, error } = await supabase
    .from("help_offer_requests")
    .insert({ ...data, status: "pending" })
    .select()
    .single();

  if (error || !created) return { data: null, error };

  // Notify the helper that someone wants their offer
  if (helpOfferForValidation.helper_id) {
    await createNotification({
      user_id: helpOfferForValidation.helper_id,
      type: "help_offer_request_received",
      title: "Someone wants your help",
      message: `A user requested your offer: "${helpOfferForValidation.title}"`,
      related_id: created.id,
      related_type: "help_offer",
    });
  }

  return { data: created as HelpOfferRequest, error: null };
}

// Helper accepts a help_offer_request → creates a session via help_offer_request_id
export async function acceptHelpOfferRequest(
  helpOfferRequestId: string,
  scheduledAt?: string
) {
  // 1. Fetch the request + linked help_offer for all context we need
  const { data: hor, error: fetchError } = await supabase
    .from("help_offer_requests")
    .select(`
    id,
    requester_id,
    help_offer_id,
    help_offer:help_offers!help_offer_requests_help_offer_id_fkey(
      helper_id,
      credit_cost,
      duration_minutes,
      title,
      proposed_at
    )
  `)
    .eq("id", helpOfferRequestId)
    .single();

  if (fetchError || !hor) return { data: null, error: fetchError };

  const helpOffer = Array.isArray(hor.help_offer) ? hor.help_offer[0] : hor.help_offer;
  if (!helpOffer) return { data: null, error: new Error("Help offer not found") };

  // 2. Mark the request as accepted
  const { error: acceptError } = await supabase
    .from("help_offer_requests")
    .update({ status: "accepted" })
    .eq("id", helpOfferRequestId);

  if (acceptError) return { data: null, error: acceptError };

  // 3. Reject any other pending requests on the same help_offer
  await supabase
    .from("help_offer_requests")
    .update({ status: "rejected" })
    .eq("help_offer_id", hor.help_offer_id)
    .neq("id", helpOfferRequestId)
    .eq("status", "pending");

  // 4. Close the help_offer so it stops appearing in Explore
  await supabase
    .from("help_offers")
    .update({ status: "accepted" })
    .eq("id", hor.help_offer_id);

  // 5. Create or refresh the session — store help_offer_request_id (Flow 2)
  const { data: session, error: sessionError } = await ensureSessionForBooking({
    helper_id: helpOffer.helper_id,
    requester_id: hor.requester_id,
    help_offer_request_id: helpOfferRequestId,
    duration_minutes: helpOffer.duration_minutes,
    scheduled_at: scheduledAt ?? (helpOffer as any).proposed_at ?? null,
  });

  if (sessionError) return { data: null, error: sessionError };

  // 6. Notify the requester
  await createNotification({
    user_id: hor.requester_id,
    type: "help_offer_request_accepted",
    title: "Your request was accepted",
    message: `The helper accepted your request for: "${helpOffer.title}"`,
    related_id: session.id,
    related_type: "session",
  });

  return { data: session, error: null };
}

export async function rejectHelpOfferRequest(helpOfferRequestId: string) {
  const { data: hor, error: fetchError } = await supabase
    .from("help_offer_requests")
    .select("requester_id, help_offer_id")
    .eq("id", helpOfferRequestId)
    .single();

  if (fetchError) return { error: fetchError };

  const { error } = await supabase
    .from("help_offer_requests")
    .update({ status: "rejected" })
    .eq("id", helpOfferRequestId);

  if (!error && hor?.requester_id) {
    const { data: helpOffer } = await supabase
      .from("help_offers")
      .select("title")
      .eq("id", hor.help_offer_id)
      .single();

    await createNotification({
      user_id: hor.requester_id,
      type: "help_offer_request_rejected",
      title: "Your request was declined",
      message: `The helper declined your request${helpOffer?.title ? ` for: "${helpOffer.title}"` : ""}`,
      related_id: helpOfferRequestId,
      related_type: "help_offer",
    });
  }

  return { error };
}

export async function withdrawHelpOfferRequest(helpOfferRequestId: string) {
  return await supabase
    .from("help_offer_requests")
    .delete()
    .eq("id", helpOfferRequestId);
}
