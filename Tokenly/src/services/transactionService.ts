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

  // Older balances may exist without matching earn/bonus transactions.
  // Reconcile the summary with the real profile balance so the dashboard
  // does not show impossible states like balance 0 with no prior earnings.
  const earned = Math.max(trackedEarned, available + spent);

  return { data: { available, earned, spent, total: available }, error: null };
}
