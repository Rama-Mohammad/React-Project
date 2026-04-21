import { supabase } from "../lib/supabaseClient";
import { getSessionsAuthDebugContext, logSessionsQuery } from "./sessionDebug";
import type { SessionStatus } from "../types/session";
// import { createTransaction } from "./transactionService";

export type SessionInsertInput = {
  helper_id: string;
  requester_id: string;
  scheduled_at?: string;
  duration_minutes?: number;
  request_id?: string;
  offer_id?: string;
  help_offer_request_id?: string;
  direct_request_id?: string;
};

type SessionRelationKey = "offer_id" | "help_offer_request_id" | "direct_request_id";

function getSessionRelationLookup(data: SessionInsertInput): { column: SessionRelationKey; value: string } | null {
  if (data.offer_id) return { column: "offer_id", value: data.offer_id };
  if (data.help_offer_request_id) return { column: "help_offer_request_id", value: data.help_offer_request_id };
  if (data.direct_request_id) return { column: "direct_request_id", value: data.direct_request_id };
  return null;
}

export async function ensureSessionForBooking(data: SessionInsertInput) {
  const { session, user, authError } = await getSessionsAuthDebugContext();
  const relationLookup = getSessionRelationLookup(data);
  const payload = { ...data, status: "upcoming" };

  logSessionsQuery("ensureSessionForBooking start", { session, user, payload, error: authError });
  if (authError) return { data: null, error: authError };

  if (!relationLookup) {
    return {
      data: null,
      error: new Error("A booking session must be linked to an offer, help-offer request, or direct request."),
    };
  }

  const existingLookup = await supabase
    .from("sessions")
    .select("id, status")
    .eq(relationLookup.column, relationLookup.value)
    .maybeSingle();

  logSessionsQuery("ensureSessionForBooking existing lookup result", {
    session,
    user,
    payload: relationLookup,
    error: existingLookup.error,
  });

  if (existingLookup.error) {
    return { data: null, error: existingLookup.error };
  }

  if (existingLookup.data?.id) {
    const updates: Record<string, unknown> = {
      helper_id: data.helper_id,
      requester_id: data.requester_id,
      duration_minutes: data.duration_minutes ?? null,
    };

    if (data.scheduled_at !== undefined) {
      updates.scheduled_at = data.scheduled_at;
    }

    if (existingLookup.data.status === "cancelled") {
      updates.status = "upcoming";
    }

    const updateResult = await supabase
      .from("sessions")
      .update(updates)
      .eq("id", existingLookup.data.id)
      .select()
      .single();

    logSessionsQuery("ensureSessionForBooking existing session update result", {
      session,
      user,
      payload: { sessionId: existingLookup.data.id, updates },
      error: updateResult.error,
    });

    return updateResult;
  }

  const createResult = await supabase
    .from("sessions")
    .insert(payload)
    .select()
    .single();

  logSessionsQuery("ensureSessionForBooking insert result", { session, user, payload, error: createResult.error });
  return createResult;
}

export async function createSession(data: SessionInsertInput) {
  const { session, user, authError } = await getSessionsAuthDebugContext();
  const payload = { ...data, status: "upcoming" };
  logSessionsQuery("createSession insert start", { session, user, payload, error: authError });
  if (authError) return { data: null, error: authError };

  const { data: created, error } = await supabase
    .from("sessions")
    .insert(payload)
    .select()
    .single();

  logSessionsQuery("createSession insert result", { session, user, payload, error });
  return { data: created, error };
}

export async function getSessionById(id: string) {
  const { session, user, authError } = await getSessionsAuthDebugContext();
  const payload = { id };

  logSessionsQuery("getSessionById start", { session, user, payload, error: authError });
  if (authError) {
    return { data: null, error: authError };
  }

  const result = await supabase
    .from("sessions")
    .select(`
      *,
      helper:profiles!sessions_helper_id_fkey(*),
      requester:profiles!sessions_requester_id_fkey(*),
      request:requests(*),
      help_offer_request:help_offer_requests(*, help_offer:help_offers(*)),
      direct_request:direct_requests(*)
    `)
    .eq("id", id)
    .single();
  logSessionsQuery("getSessionById result", { session, user, payload, error: result.error });
  return result;
}

export async function getSessionsByUser(user_id: string) {
  const { session, user, authError } = await getSessionsAuthDebugContext();
  const payload = {
    user_id,
    filter: `.or(helper_id.eq.${user_id},requester_id.eq.${user_id})`,
  };

  logSessionsQuery("getSessionsByUser start", { session, user, payload, error: authError });
  if (authError) {
    return { data: null, error: authError };
  }

  const result = await supabase
    .from("sessions")
    .select(`
      *,
      request:requests(id, title, category, credit_cost),
      help_offer_request:help_offer_requests!sessions_help_offer_request_id_fkey(
        id,
        help_offer:help_offers!help_offer_requests_help_offer_id_fkey(
          id,
          title,
          category,
          credit_cost
        )
      ),
      direct_request:direct_requests!sessions_direct_request_id_fkey(
        id,
        title,
        category,
        credit_cost
      ),
      helper:profiles!helper_id(id, full_name, username, profile_image_url),
      requester:profiles!requester_id(id, full_name, username, profile_image_url)
    `)
    .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`)
    .order("scheduled_at", { ascending: false });
  logSessionsQuery("getSessionsByUser result", { session, user, payload, error: result.error });
  return result;
}

export async function getSessionsByStatus(user_id: string, status: SessionStatus) {
  const { session, user, authError } = await getSessionsAuthDebugContext();
  const payload = {
    user_id,
    status,
    filter: `.or(helper_id.eq.${user_id},requester_id.eq.${user_id})`,
  };

  logSessionsQuery("getSessionsByStatus start", { session, user, payload, error: authError });
  if (authError) {
    return { data: null, error: authError };
  }

  const result = await supabase
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
  logSessionsQuery("getSessionsByStatus result", { session, user, payload, error: result.error });
  return result;
}

export async function updateSessionStatus(id: string, status: SessionStatus) {
  const updates: Record<string, unknown> = { status };
  if (status === "completed") updates.completed_at = new Date().toISOString();

  const { session, user, authError } = await getSessionsAuthDebugContext();
  const payload = { id, updates };

  logSessionsQuery("updateSessionStatus start", { session, user, payload, error: authError });
  if (authError) {
    return { data: null, error: authError };
  }

  if (status === "completed") {
    const settlementLookup = await supabase
      .from("sessions")
      .select("id, status, helper_id, requester_id, request_id, help_offer_request_id, direct_request_id")
      .eq("id", id)
      .single();

    logSessionsQuery("updateSessionStatus settlement lookup result", {
      session,
      user,
      payload: { id, status },
      error: settlementLookup.error,
    });

    if (settlementLookup.error || !settlementLookup.data) {
      return { data: null, error: settlementLookup.error };
    }

    const sessionRow = settlementLookup.data as {
      id: string;
      status: SessionStatus;
      helper_id: string;
      requester_id: string;
      request_id: string | null;
      help_offer_request_id: string | null;
      direct_request_id: string | null;
    };

    if (user?.id !== sessionRow.helper_id) {
      return {
        data: null,
        error: new Error("Only the helper can mark this session as completed."),
      };
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc("complete_session", {
      p_session_id: id,
    });

    logSessionsQuery("updateSessionStatus complete_session rpc result", {
      session,
      user,
      payload: { id },
      error: rpcError,
    });

    if (rpcError) {
      return { data: null, error: rpcError };
    }
    if (rpcData?.error) {
      const rawMsg: string = rpcData.error;
      const friendlyMsg =
        rawMsg === "Requester does not have enough tokens"
          ? "The requester doesn't have enough tokens to pay for this session."
          : rawMsg;
      return { data: null, error: new Error(friendlyMsg) };
    }
    return { data: null, error: null };
  }
  const { error } = await supabase
    .from("sessions")
    .update(updates)
    .eq("id", id);

  logSessionsQuery("updateSessionStatus result", { session, user, payload, error });
  return { data: null, error };
}
