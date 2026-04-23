import { supabase } from "../lib/supabaseClient";
import type { TransactionType } from "../types/transaction";

export async function getTransactionsByUser(user_id: string) {
  return await supabase
    .from("credit_transactions")
    .select("id, user_id, session_id, amount, type, description, created_at")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(50);
}

export function subscribeToTransactionsByUser(
  user_id: string,
  callback: () => void
) {
  const topic = `credit-transactions:${user_id}`;

  supabase
    .getChannels()
    .filter((channel) => channel.topic === topic)
    .forEach((channel) => {
      void supabase.removeChannel(channel);
    });

  const channel = supabase
    .channel(topic)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "credit_transactions",
        filter: `user_id=eq.${user_id}`,
      },
      () => callback()
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || error) {
        console.error("[credit_transactions] realtime subscribe failed", {
          user_id,
          status,
          error,
        });
      }
    });

  return channel;
}

export async function getTransactionsBySession(session_id: string) {
  return await supabase
    .from("credit_transactions")
    .select("id, user_id, session_id, amount, type, description, created_at")
    .eq("session_id", session_id);
}

export async function createTransaction(data: {
  user_id: string;
  session_id?: string;
  amount: number;
  type: TransactionType;
  description?: string;
}) {
  return await supabase
    .from("credit_transactions")
    .insert(data)
    .select()
    .single();
}

export async function getUserCreditSummary(user_id: string) {
  const [{ data: transactions, error: transactionsError }, { data: profile, error: profileError }] = await Promise.all([
    supabase
      .from("credit_transactions")
      .select("amount, type")
      .eq("user_id", user_id),
    supabase
      .from("profiles")
      .select("credit_balance")
      .eq("id", user_id)
      .single(),
  ]);

  if (transactionsError || profileError || !transactions) {
    return {
      data: null,
      error: transactionsError ?? profileError,
    };
  }

  const available = Number(profile?.credit_balance ?? 0);

  const trackedEarned = transactions
    .filter((t) => t.type === "earn" || t.type === "bonus")
    .reduce((sum, t) => sum + t.amount, 0);

  const spent = transactions
    .filter((t) => t.type === "spend")
    .reduce((sum, t) => sum + t.amount, 0);

  const earned = Math.max(trackedEarned, available + spent);

  return { data: { available, earned, spent, total: available }, error: null };
}

