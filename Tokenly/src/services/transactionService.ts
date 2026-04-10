import { supabase } from "../lib/supabaseClient";
import type { TransactionType } from "../types/transaction";

export async function getTransactionsByUser(user_id: string) {
  return await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
}

export async function getTransactionsBySession(session_id: string) {
  return await supabase
    .from("credit_transactions")
    .select("*")
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
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("amount, type")
    .eq("user_id", user_id);

  if (error || !data) return { data: null, error };

  const earned = data
    .filter((t) => t.type === "earn" || t.type === "bonus")
    .reduce((sum, t) => sum + t.amount, 0);

  const spent = data
    .filter((t) => t.type === "spend")
    .reduce((sum, t) => sum + t.amount, 0);

  return { data: { earned, spent, total: earned - spent }, error: null };
}