import { supabase } from "../lib/supabaseClient";

export async function getPortfolioByUser(user_id: string) {
  return await supabase
    .from("portfolio_items")
    .select("id, user_id, title, description, type, tags, date, created_at")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
}

export async function createPortfolioItem(data: {
  user_id: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  tags?: string[];
  date?: string;
}) {
  return await supabase
    .from("portfolio_items")
    .insert(data)
    .select()
    .single();
}

export async function updatePortfolioItem(
  id: string,
  updates: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    tags?: string[];
    date?: string;
  }
) {
  return await supabase
    .from("portfolio_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
}

export async function deletePortfolioItem(id: string) {
  return await supabase.from("portfolio_items").delete().eq("id", id);
}

