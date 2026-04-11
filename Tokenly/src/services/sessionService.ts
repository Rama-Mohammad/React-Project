import { supabase } from "../lib/supabaseClient";
import { getSessionsAuthDebugContext, logSessionsQuery } from "./sessionDebug";
import type { SessionStatus } from "../types/session";
import { createTransaction } from "./transactionService";

export async function createSession(data: {
  request_id: string;
  offer_id: string;
  helper_id: string;
  requester_id: string;
  scheduled_at?: string;
  duration_minutes?: number;
}) {
  const { session, user, authError } = await getSessionsAuthDebugContext();
  const payload = { ...data, status: "upcoming" };

  logSessionsQuery("createSession insert start", { session, user, payload, error: authError });
  if (authError) {
    return { data: null, error: authError };
  }

  const { error } = await supabase.from("sessions").insert(payload);
  logSessionsQuery("createSession insert result", { session, user, payload, error });
  return { data: null, error };
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
    .select("*, request:requests(*), helper:profiles!helper_id(*), requester:profiles!requester_id(*)")
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
      .select(`
        id,
        status,
        helper_id,
        requester_id,
        request:requests(id, title, credit_cost)
      `)
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
      request: { id: string; title: string; credit_cost: number | null } | { id: string; title: string; credit_cost: number | null }[] | null;
    };

    const requestValue = Array.isArray(sessionRow.request) ? sessionRow.request[0] ?? null : sessionRow.request;
    const creditCost = Math.max(0, Number(requestValue?.credit_cost ?? 0));

    if (sessionRow.status !== "completed" && creditCost > 0) {
      const existingTransactions = await supabase
        .from("credit_transactions")
        .select("id, user_id, type")
        .eq("session_id", id);

      logSessionsQuery("updateSessionStatus settlement transaction lookup result", {
        session,
        user,
        payload: { id, creditCost },
        error: existingTransactions.error,
      });

      if (existingTransactions.error) {
        return { data: null, error: existingTransactions.error };
      }

      const transactions = existingTransactions.data ?? [];
      const hasRequesterSpend = transactions.some(
        (item) => item.user_id === sessionRow.requester_id && item.type === "spend"
      );
      const hasHelperEarn = transactions.some(
        (item) => item.user_id === sessionRow.helper_id && item.type === "earn"
      );

      if (!hasRequesterSpend) {
        const { data: requesterProfile, error: requesterProfileError } = await supabase
          .from("profiles")
          .select("credit_balance")
          .eq("id", sessionRow.requester_id)
          .single();

        if (requesterProfileError) {
          return { data: null, error: requesterProfileError };
        }

        const requesterBalance = Number(requesterProfile?.credit_balance ?? 0);
        if (requesterBalance < creditCost) {
          return { data: null, error: new Error("Not enough tokens to complete this session.") };
        }

        const { error: requesterUpdateError } = await supabase
          .from("profiles")
          .update({ credit_balance: requesterBalance - creditCost })
          .eq("id", sessionRow.requester_id);

        if (requesterUpdateError) {
          return { data: null, error: requesterUpdateError };
        }

        const { error: requesterTransactionError } = await createTransaction({
          user_id: sessionRow.requester_id,
          session_id: id,
          amount: creditCost,
          type: "spend",
          description: `Spent on completed session${requestValue?.title ? `: ${requestValue.title}` : ""}`,
        });

        if (requesterTransactionError) {
          return { data: null, error: requesterTransactionError };
        }
      }

      if (!hasHelperEarn) {
        const { data: helperProfile, error: helperProfileError } = await supabase
          .from("profiles")
          .select("credit_balance")
          .eq("id", sessionRow.helper_id)
          .single();

        if (helperProfileError) {
          return { data: null, error: helperProfileError };
        }

        const helperBalance = Number(helperProfile?.credit_balance ?? 0);
        const { error: helperUpdateError } = await supabase
          .from("profiles")
          .update({ credit_balance: helperBalance + creditCost })
          .eq("id", sessionRow.helper_id);

        if (helperUpdateError) {
          return { data: null, error: helperUpdateError };
        }

        const { error: helperTransactionError } = await createTransaction({
          user_id: sessionRow.helper_id,
          session_id: id,
          amount: creditCost,
          type: "earn",
          description: `Earned from completed session${requestValue?.title ? `: ${requestValue.title}` : ""}`,
        });

        if (helperTransactionError) {
          return { data: null, error: helperTransactionError };
        }
      }
    }
  }

  const { error } = await supabase
    .from("sessions")
    .update(updates)
    .eq("id", id);

  logSessionsQuery("updateSessionStatus result", { session, user, payload, error });
  return { data: null, error };
}
