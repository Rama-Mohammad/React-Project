import { supabase } from "../lib/supabaseClient";
import { getSessionsAuthDebugContext, logSessionsQuery } from "./sessionDebug";
import type { SessionStatus } from "../types/session";
import { createNotification } from "./notificationService";

export type SessionInsertInput = {
  helper_id: string;
  requester_id: string;
  scheduled_at?: string | null;
  duration_minutes?: number;
  request_id?: string;
  offer_id?: string;
  help_offer_request_id?: string;
  direct_request_id?: string;
};

type SessionRelationKey = "offer_id" | "help_offer_request_id" | "direct_request_id";
type HelpOfferTitleRelation = {
  help_offer?: { title?: string | null } | Array<{ title?: string | null }> | null;
};
type CompleteSessionRpcResult = { error?: string | null } | null;

function getSessionRelationLookup(data: SessionInsertInput): { column: SessionRelationKey; value: string } | null {
  if (data.offer_id) return { column: "offer_id", value: data.offer_id };
  if (data.help_offer_request_id) return { column: "help_offer_request_id", value: data.help_offer_request_id };
  if (data.direct_request_id) return { column: "direct_request_id", value: data.direct_request_id };
  return null;
}

function getSessionEndTime(start: Date, durationMinutes?: number | null) {
  return new Date(start.getTime() + Math.max(1, Number(durationMinutes ?? 30)) * 60 * 1000);
}

function sessionsOverlap(
  firstStart: Date,
  firstDurationMinutes: number | null | undefined,
  secondStart: Date,
  secondDurationMinutes: number | null | undefined
) {
  const firstEnd = getSessionEndTime(firstStart, firstDurationMinutes);
  const secondEnd = getSessionEndTime(secondStart, secondDurationMinutes);

  return firstStart < secondEnd && secondStart < firstEnd;
}

export async function validateSessionScheduleAvailability(
  data: Pick<SessionInsertInput, "helper_id" | "requester_id" | "scheduled_at" | "duration_minutes">,
  excludeSessionId?: string
) {
  if (!data.scheduled_at) return { error: null };

  const requestedStart = new Date(data.scheduled_at);
  if (Number.isNaN(requestedStart.getTime())) {
    return { error: new Error("Please choose a valid session date and time.") };
  }

  const { data: existingSessions, error } = await supabase
    .from("sessions")
    .select("id, helper_id, requester_id, scheduled_at, duration_minutes, status")
    .or(
      [
        `helper_id.eq.${data.helper_id}`,
        `requester_id.eq.${data.helper_id}`,
        `helper_id.eq.${data.requester_id}`,
        `requester_id.eq.${data.requester_id}`,
      ].join(",")
    )
    .in("status", ["upcoming", "active"])
    .not("scheduled_at", "is", null);

  if (error) return { error };

  const conflictingSession = (existingSessions ?? []).find((sessionRow) => {
    if (excludeSessionId && sessionRow.id === excludeSessionId) return false;
    if (!sessionRow.scheduled_at) return false;

    const existingStart = new Date(sessionRow.scheduled_at);
    if (Number.isNaN(existingStart.getTime())) return false;

    return sessionsOverlap(
      requestedStart,
      data.duration_minutes,
      existingStart,
      sessionRow.duration_minutes
    );
  });

  if (conflictingSession) {
    return {
      error: new Error("You already have a session scheduled during this time."),
    };
  }

  return { error: null };
}

function getNestedRelationValue<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type SessionRecordForNormalization = {
  id?: string;
  request?: { title?: string | null } | null;
  help_offer_request?:
    | { help_offer?: { title?: string | null } | Array<{ title?: string | null }> | null }
    | Array<{ help_offer?: { title?: string | null } | Array<{ title?: string | null }> | null }>
    | null;
  direct_request?: { title?: string | null } | Array<{ title?: string | null }> | null;
};

function normalizeSessionRecord<
  T extends {
    id?: string;
    request?: { title?: string | null } | null;
    help_offer_request?: { help_offer?: { title?: string | null } | Array<{ title?: string | null }> | null } | Array<{ help_offer?: { title?: string | null } | Array<{ title?: string | null }> | null }> | null;
    direct_request?: { title?: string | null } | Array<{ title?: string | null }> | null;
  }
>(session: T): T & { title: string } {
  if (!session.request) {
    console.warn("Missing request for session", session.id);
  }

  const helpOfferRequest = getNestedRelationValue(session.help_offer_request);
  const helpOffer = getNestedRelationValue(helpOfferRequest?.help_offer);
  const directRequest = getNestedRelationValue(session.direct_request);

  return {
    ...session,
    title: session.request?.title ?? helpOffer?.title ?? directRequest?.title ?? "Session",
  };
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
    const availabilityResult = await validateSessionScheduleAvailability(data, existingLookup.data.id);
    if (availabilityResult.error) return { data: null, error: availabilityResult.error };

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

  const availabilityResult = await validateSessionScheduleAvailability(data);
  if (availabilityResult.error) return { data: null, error: availabilityResult.error };

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

  const availabilityResult = await validateSessionScheduleAvailability(data);
  if (availabilityResult.error) return { data: null, error: availabilityResult.error };

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

  const sessionResult = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (sessionResult.error || !sessionResult.data) {
    logSessionsQuery("getSessionById base session result", {
      session,
      user,
      payload,
      error: sessionResult.error,
    });
    return { data: null, error: sessionResult.error ?? new Error("Session not found.") };
  }

  const baseSession = sessionResult.data as {
    id: string;
    helper_id: string;
    requester_id: string;
    status: string;
    request_id?: string | null;
    help_offer_request_id?: string | null;
    direct_request_id?: string | null;
    [key: string]: unknown;
  };

  const [
    helperResult,
    requesterResult,
    requestResult,
    helpOfferRequestResult,
    directRequestResult,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", baseSession.helper_id).maybeSingle(),
    supabase.from("profiles").select("*").eq("id", baseSession.requester_id).maybeSingle(),
    baseSession.request_id
      ? supabase.from("requests").select("*").eq("id", baseSession.request_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    baseSession.help_offer_request_id
      ? supabase
          .from("help_offer_requests")
          .select(`
            help_offer:help_offers(*)
          `)
          .eq("id", baseSession.help_offer_request_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    baseSession.direct_request_id
      ? supabase.from("direct_requests").select("*").eq("id", baseSession.direct_request_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const relationError =
    helperResult.error ??
    requesterResult.error ??
    requestResult.error ??
    helpOfferRequestResult.error ??
    directRequestResult.error;

  logSessionsQuery("getSessionById result", {
    session,
    user,
    payload,
    error: relationError,
  });

  if (relationError) {
    return { data: null, error: relationError };
  }

  const helpOfferRequest = getNestedRelationValue<HelpOfferTitleRelation>(
    helpOfferRequestResult.data as HelpOfferTitleRelation | HelpOfferTitleRelation[] | null | undefined
  );
  const helpOffer = getNestedRelationValue(helpOfferRequest?.help_offer);

  return {
    data: {
      ...baseSession,
      helper: helperResult.data ?? null,
      requester: requesterResult.data ?? null,
      request: requestResult.data ?? null,
      help_offer_request: helpOfferRequestResult.data ?? null,
      direct_request: directRequestResult.data ?? null,
      title: requestResult.data?.title ?? helpOffer?.title ?? directRequestResult.data?.title ?? "Session",
    },
    error: null,
  };
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
      id,
      status,
      scheduled_at,
      completed_at,
      created_at,
      duration_minutes,
      helper_id,
      requester_id,
      request_id,
      offer_id,
      help_offer_request_id,
      direct_request_id,
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
  const normalizedUserSessions = ((result.data ?? []) as SessionRecordForNormalization[]).map((item) =>
    normalizeSessionRecord(item)
  );
  return {
    ...result,
    data: normalizedUserSessions,
  };
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
      id,
      status,
      scheduled_at,
      completed_at,
      created_at,
      duration_minutes,
      helper_id,
      requester_id,
      request_id,
      offer_id,
      help_offer_request_id,
      direct_request_id,
      request:requests(
        id,
        title
      ),
      helper:profiles!helper_id(*),
      requester:profiles!requester_id(*)
    `)
    .or(`helper_id.eq.${user_id},requester_id.eq.${user_id}`)
    .eq("status", status)
    .order("scheduled_at", { ascending: true });
  logSessionsQuery("getSessionsByStatus result", { session, user, payload, error: result.error });
  const normalizedStatusSessions = ((result.data ?? []) as SessionRecordForNormalization[]).map((item) =>
    normalizeSessionRecord(item)
  );
  return {
    ...result,
    data: normalizedStatusSessions,
  };
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
    const rpcResult = rpcData as CompleteSessionRpcResult;

    logSessionsQuery("updateSessionStatus complete_session rpc result", {
      session,
      user,
      payload: { id },
      error: rpcError,
    });

    if (rpcError) {
      return { data: null, error: rpcError };
    }
    if (rpcResult?.error) {
      const rawMsg = rpcResult.error;
      const friendlyMsg =
        rawMsg === "Requester does not have enough tokens"
          ? "The requester doesn't have enough tokens to pay for this session."
          : rawMsg;
      return { data: null, error: new Error(friendlyMsg) };
    }

    await Promise.all([
      createNotification({
        user_id: sessionRow.requester_id,
        type: "session_completed",
        title: "Session completed",
        message: "Your session has been marked as completed.",
        related_id: id,
        related_type: "session",
      }),
      createNotification({
        user_id: sessionRow.helper_id,
        type: "session_completed",
        title: "Session completed",
        message: "This session has been marked as completed.",
        related_id: id,
        related_type: "session",
      }),
    ]);

    return { data: null, error: null };
  }

  let sessionParticipants:
    | { helper_id: string; requester_id: string; status: SessionStatus }
    | null = null;

  if (status === "active") {
    const sessionLookup = await supabase
      .from("sessions")
      .select("helper_id, requester_id, status")
      .eq("id", id)
      .maybeSingle();

    if (sessionLookup.error) {
      return { data: null, error: sessionLookup.error };
    }

    sessionParticipants = sessionLookup.data as { helper_id: string; requester_id: string; status: SessionStatus } | null;
  }

  const { error } = await supabase
    .from("sessions")
    .update(updates)
    .eq("id", id);

  logSessionsQuery("updateSessionStatus result", { session, user, payload, error });

  if (!error && status === "active" && sessionParticipants && sessionParticipants.status !== "active") {
    const recipientId =
      user?.id === sessionParticipants.helper_id
        ? sessionParticipants.requester_id
        : sessionParticipants.helper_id;

    await createNotification({
      user_id: recipientId,
      type: "session_starting",
      title: "Your session is starting",
      message: "The other participant joined and the live session is now active.",
      related_id: id,
      related_type: "session",
    });
  }

  return { data: null, error };
}

