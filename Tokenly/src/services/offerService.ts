import { supabase } from "../lib/supabaseClient";
import type { OfferStatus } from "../types/offer";

export async function createOffer(
  request_id: string,
  helper_id: string,
  message?: string
) {
  return await supabase
    .from("offers")
    .insert({ request_id, helper_id, message, status: "pending" })
    .select()
    .single();
}

export async function getOffersByRequest(request_id: string) {
  return await supabase
    .from("offers")
    .select("*, helper:profiles(*)")
    .eq("request_id", request_id)
    .order("created_at", { ascending: false });
}

export async function getOffersByHelper(helper_id: string) {
  return await supabase
    .from("offers")
    .select("*, request:requests(*)")
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