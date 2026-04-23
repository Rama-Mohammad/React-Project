import type { PostgrestError, Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import type { OfferStatus } from "../types/offer";
import type { Offer } from "../types/offer";
import type { Request } from "../types/request";
import { ensureSessionForBooking } from "./sessionService";
import { createNotification } from "./notificationService";
export function extractAvailabilityFromOfferDescription(description?: string | null) {
  if (!description) {
    return { summary: "No description provided.", availability: "Availability not provided." };
  }

  const parts = description
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  const availabilityPart = parts.find((part) => /^availability:/i.test(part));
  const summaryParts = parts.filter((part) => !/^availability:/i.test(part) && !/^note:/i.test(part));
  const notePart = parts.find((part) => /^note:/i.test(part));

  const availability = availabilityPart
    ? availabilityPart.replace(/^availability:\s*/i, "").trim()
    : "Availability not provided.";
  const note = notePart ? notePart.replace(/^note:\s*/i, "").trim() : "";
  const summary = [summaryParts.join("\n\n"), note ? `Note: ${note}` : ""]
    .filter(Boolean)
    .join("\n\n")
    .trim();

  return {
    summary: summary || "No description provided.",
    availability,
  };
}

type CreateOfferPayload = {
  request_id: string;
  helper_id: string;
  message?: string;
  availability?: string;
  status: OfferStatus;
};

type CreateOfferResult = {
  data: Offer | null;
  error: PostgrestError | Error | null;
};

function logOfferInsertDebug(
  label: string,
  details: {
    session: Session | null;
    user: User | null;
    payload: CreateOfferPayload | null;
    error?: PostgrestError | Error | null;
  }
) {
  console.log(`[offers.createOffer] ${label}`, {
    session: details.session,
    user: details.user,
    payload: details.payload,
    error: details.error ?? null,
  });
}

export async function createOffer(
  request_id: string,
  message?: string,
  availability?: string,
  notificationMeta?: {
    requesterId?: string | null;
    requestTitle?: string | null;
  }
): Promise<CreateOfferResult> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  const session = sessionData.session;
  const user = userData.user;

  if (sessionError || userError) {
    const authError = sessionError ?? userError ?? new Error("Could not verify authentication.");
    logOfferInsertDebug("auth lookup failed", {
      session,
      user,
      payload: null,
      error: authError,
    });
    return { data: null, error: authError };
  }

  if (!session || !user?.id) {
    const authError = new Error("You must be signed in with an active session to submit an offer.");
    logOfferInsertDebug("missing authenticated user or session", {
      session,
      user,
      payload: null,
      error: authError,
    });
    return { data: null, error: authError };
  }

  const payload: CreateOfferPayload = {
    request_id,
    helper_id: user.id,
    message,
    availability,
    status: "pending",
  };

  logOfferInsertDebug("about to insert", {
    session,
    user,
    payload,
  });

  const { data, error } = await supabase
    .from("offers")
    .insert(payload)
    .select()
    .single();

  if (error) {
    logOfferInsertDebug("insert failed", {
      session,
      user,
      payload,
      error,
    });
    return { data: null, error };
  }

  logOfferInsertDebug("insert succeeded", {
    session,
    user,
    payload,
  });

  const requesterId = notificationMeta?.requesterId ?? null;
  const requestTitle = notificationMeta?.requestTitle ?? null;

  if (requesterId && requesterId !== user.id) {
    await createNotification({
      user_id: requesterId,
      type: "offer_received",
      title: "New offer received",
      message: requestTitle
        ? `Someone submitted an offer for "${requestTitle}"`
        : "Someone submitted an offer for your request",
      related_id: request_id,
      related_type: "request",
    });
  } else {
    console.warn("[notifications] offer_received skipped", {
      request_id,
      requesterId,
      helperId: user.id,
      requestTitle,
    });
  }

  return { data: data as Offer, error: null };
}

export type OfferForRequestRow = {
  id: string;
  request_id: string;
  helper_id: string;
  message: string | null;
  availability: string | null;
  status: OfferStatus;
  created_at: string;
  helper: {
    id: string;
    full_name: string | null;
    username: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
  } | null;
};

export type OfferForHelperRow = {
  id: string;
  request_id: string;
  helper_id: string;
  message: string | null;
  availability: string | null;
  status: OfferStatus;
  created_at: string;
  request: {
    id: string;
    title: string;
    category: string | null;
    status: string;
    urgency: string | null;
    credit_cost: number | null;
    duration_minutes: number | null;
  } | null;
};

export type OfferAppointmentRow = {
  id: string;
  request_id: string;
  helper_id: string;
  message: string | null;
  availability: string | null;
  status: OfferStatus;
  created_at: string;
  request: {
    id: string;
    requester_id: string;
    title: string;
    description: string;
    category: string | null;
    urgency: string | null;
    credit_cost: number | null;
    duration_minutes: number | null;
    status: string;
  } | null;
  helper: {
    id: string;
    full_name: string | null;
    username: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
  } | null;
};

export type HelpOfferAppointmentRow = {
  id: string;
  helper_id: string;
  title: string;
  description: string | null;
  category: string | null;
  urgency: string | null;
  duration_minutes: number | null;
  credit_cost: number | null;
  status: string;
  created_at: string;
  helper: {
    id: string;
    full_name: string | null;
    username: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
  } | null;
};


export async function getOffersForRequest(requestId: string) {
  const result = await supabase
    .from("offers")
    .select(`
      id,
      request_id,
      helper_id,
      message,
      availability,
      status,
      created_at,
      helper:profiles!offers_helper_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      )
    `)
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });

  if (result.error || !result.data) {
    return { data: [] as OfferForRequestRow[], error: result.error };
  }

  const normalized = result.data.map((row) => {
    const helperValue = (
      row as {
        helper:
        | OfferForRequestRow["helper"]
        | OfferForRequestRow["helper"][];
      }
    ).helper;

    return {
      ...row,
      helper: Array.isArray(helperValue) ? helperValue[0] ?? null : helperValue ?? null,
    } as OfferForRequestRow;
  });

  return { data: normalized, error: null };
}

export async function getOffersForHelper(helperId: string) {
  const result = await supabase
    .from("offers")
    .select(`
      id,
      request_id,
      helper_id,
      message,
      availability,
      status,
      created_at,
      request:requests!offers_request_id_fkey(
        id,
        title,
        category,
        status,
        urgency,
        credit_cost,
        duration_minutes
      )
    `)
    .eq("helper_id", helperId)
    .order("created_at", { ascending: false });

  if (result.error || !result.data) {
    return { data: [] as OfferForHelperRow[], error: result.error };
  }

  const normalized = result.data.map((row) => {
    const requestValue = (
      row as {
        request:
        | OfferForHelperRow["request"]
        | OfferForHelperRow["request"][];
      }
    ).request;

    return {
      ...row,
      request: Array.isArray(requestValue) ? requestValue[0] ?? null : requestValue ?? null,
    } as OfferForHelperRow;
  });

  return { data: normalized, error: null };
}

export async function acceptOffer(
  offerId: string,
  request: Pick<Request, "id" | "requester_id" | "duration_minutes" | "credit_cost">,
  scheduledAt?: string
) {
  const { data: offer, error: offerFetchError } = await supabase
    .from("offers")
    .select("id, request_id, helper_id, status")
    .eq("id", offerId)
    .single();

  if (offerFetchError) {
    return { data: null, error: offerFetchError };
  }

  if (offer.request_id !== request.id) {
    return { data: null, error: new Error("This offer does not belong to this request.") };
  }

  if (offer.status !== "pending") {
    return { data: null, error: new Error("This offer is no longer pending.") };
  }

  const { data: requestRecord, error: requestRecordError } = await supabase
    .from("requests")
    .select("id, title, status")
    .eq("id", request.id)
    .maybeSingle();

  if (requestRecordError) {
    return { data: null, error: requestRecordError };
  }

  if (!requestRecord) {
    return { data: null, error: new Error("Request not found.") };
  }

  if (requestRecord.status !== "open") {
    return { data: null, error: new Error("This request already has an accepted offer.") };
  }

  const { data: existingAcceptedOffer, error: existingAcceptedOfferError } = await supabase
    .from("offers")
    .select("id")
    .eq("request_id", request.id)
    .neq("id", offerId)
    .eq("status", "accepted")
    .maybeSingle();

  if (existingAcceptedOfferError) {
    return { data: null, error: existingAcceptedOfferError };
  }

  if (existingAcceptedOffer) {
    return { data: null, error: new Error("This request already has an accepted offer.") };
  }

  const { data: rejectedPendingOffers } = await supabase
    .from("offers")
    .select("id, helper_id")
    .eq("request_id", request.id)
    .neq("id", offerId)
    .eq("status", "pending");

  const { data: acceptedOffer, error: acceptError } = await supabase
    .from("offers")
    .update({ status: "accepted" })
    .eq("id", offerId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (acceptError) {
    return { data: null, error: acceptError };
  }

  if (!acceptedOffer) {
    return { data: null, error: new Error("This offer is no longer pending.") };
  }

  const { error: rejectOthersError } = await supabase
    .from("offers")
    .update({ status: "rejected" })
    .eq("request_id", request.id)
    .neq("id", offerId)
    .eq("status", "pending");

  if (rejectOthersError) {
    return { data: null, error: rejectOthersError };
  }

  const { data: sessionData, error: sessionError } = await ensureSessionForBooking({
    request_id: request.id,
    offer_id: offer.id,
    helper_id: offer.helper_id,
    requester_id: request.requester_id,
    scheduled_at: scheduledAt,
    duration_minutes: request.duration_minutes,
  });

  if (sessionError) {
    return { data: null, error: sessionError };
  }

  const { error: requestUpdateError } = await supabase
    .from("requests")
    .update({ status: "accepted" })
    .eq("id", request.id);

  if (requestUpdateError) {
    return { data: null, error: requestUpdateError };
  }

  await createNotification({
    user_id: offer.helper_id,
    type: "offer_accepted",
    title: "Your offer was accepted",
    message: `The requester accepted your offer`,
    related_id: sessionData?.id ?? offerId,
    related_type: "session",
  });

  if (rejectedPendingOffers?.length) {
    await Promise.all(
      rejectedPendingOffers.map((rejectedOffer) =>
        createNotification({
          user_id: rejectedOffer.helper_id,
          type: "offer_rejected",
          title: "Your offer was not selected",
          message: requestRecord?.title
            ? `Another offer was accepted for "${requestRecord.title}"`
            : "Another offer was accepted for this request",
          related_id: request.id,
          related_type: "request",
        })
      )
    );
  }

  return { data: sessionData, error: null };
}

export async function rejectOffer(offerId: string) {
  const { data: offerRecord, error: offerLookupError } = await supabase
    .from("offers")
    .select(`
      id,
      helper_id,
      request_id,
      request:requests!offers_request_id_fkey(
        id,
        title
      )
    `)
    .eq("id", offerId)
    .maybeSingle();

  if (offerLookupError) {
    return { data: null, error: offerLookupError };
  }

  const result = await supabase
    .from("offers")
    .update({ status: "rejected" })
    .eq("id", offerId)
    .select()
    .single();

  if (!result.error && offerRecord?.helper_id) {
    const requestValue = (
      offerRecord as {
        request:
          | { id: string; title: string | null }
          | { id: string; title: string | null }[]
          | null;
      }
    ).request;
    const requestDetails = Array.isArray(requestValue) ? requestValue[0] ?? null : requestValue ?? null;

    await createNotification({
      user_id: offerRecord.helper_id,
      type: "offer_rejected",
      title: "Your offer was rejected",
      message: requestDetails?.title
        ? `Your offer for "${requestDetails.title}" was rejected`
        : "Your offer was rejected",
      related_id: requestDetails?.id ?? offerRecord.request_id,
      related_type: "request",
    });
  }

  return result;
}

export async function getOfferAppointmentDetails(offerId: string) {
  const result = await supabase
    .from("offers")
    .select(`
      id,
      request_id,
      helper_id,
      message,
      availability,
      status,
      created_at,
      request:requests!offers_request_id_fkey(
        id,
        requester_id,
        title,
        description,
        category,
        urgency,
        credit_cost,
        duration_minutes,
        status
      ),
      helper:profiles!offers_helper_id_fkey(
        id,
        full_name,
        username,
        avg_rating,
        profile_image_url
      )
    `)
    .eq("id", offerId)
    .maybeSingle();

  if (result.error || !result.data) {
    return { data: null as OfferAppointmentRow | null, error: result.error };
  }

  const requestValue = (
    result.data as {
      request:
      | OfferAppointmentRow["request"]
      | OfferAppointmentRow["request"][];
      helper:
      | OfferAppointmentRow["helper"]
      | OfferAppointmentRow["helper"][];
    }
  ).request;
  const helperValue = (
    result.data as {
      request:
      | OfferAppointmentRow["request"]
      | OfferAppointmentRow["request"][];
      helper:
      | OfferAppointmentRow["helper"]
      | OfferAppointmentRow["helper"][];
    }
  ).helper;

  return {
    data: {
      ...result.data,
      request: Array.isArray(requestValue) ? requestValue[0] ?? null : requestValue ?? null,
      helper: Array.isArray(helperValue) ? helperValue[0] ?? null : helperValue ?? null,
    } as OfferAppointmentRow,
    error: null,
  };
}

export async function getHelpOfferAppointmentDetails(helpOfferId: string) {
  const result = await supabase
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
      )
    `)
    .eq("id", helpOfferId)
    .maybeSingle();

  if (result.error || !result.data) {
    return { data: null as HelpOfferAppointmentRow | null, error: result.error };
  }

  const helperValue = (result.data as { helper: HelpOfferAppointmentRow["helper"] | HelpOfferAppointmentRow["helper"][] }).helper;

  return {
    data: {
      ...result.data,
      helper: Array.isArray(helperValue) ? helperValue[0] ?? null : helperValue ?? null,
    } as HelpOfferAppointmentRow,
    error: null,
  };
}

/** @deprecated Use getHelpOfferAppointmentDetails instead */
export const getIndependentOfferAppointmentDetails = getHelpOfferAppointmentDetails;

export async function getOffersByRequest(request_id: string) {
  return await supabase
    .from("offers")
    .select(`
    id, request_id, helper_id, message, availability, status, created_at,
    helper:profiles!offers_helper_id_fkey(
    id, full_name, username, avg_rating, profile_image_url
  )
`)
    .eq("request_id", request_id)
    .order("created_at", { ascending: false });
}

export async function getOffersByHelper(helper_id: string) {
  return await supabase
    .from("offers")
    .select(`
    id, request_id, helper_id, message, availability, status, created_at,
    request:requests!offers_request_id_fkey(
    id, title, category, status, urgency, credit_cost, duration_minutes
  )
`)
    .eq("helper_id", helper_id)
    .order("created_at", { ascending: false });
}

export async function updateOfferStatus(id: string, status: OfferStatus) {
  return await supabase
    .from("offers")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteOffer(id: string) {
  return await supabase.from("offers").delete().eq("id", id);
}
