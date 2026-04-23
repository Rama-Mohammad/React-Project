import { supabase } from "../lib/supabaseClient";

export async function createReview(data: {
  session_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
}) {
  return await supabase
    .from("reviews")
    .insert(data)
    .select()
    .single();
}

export async function getReviewsByUser(reviewee_id: string) {
  return await supabase
    .from("reviews")
    .select("*, reviewer:profiles!reviews_reviewer_id_fkey(*), session:sessions(*)")
    .eq("reviewee_id", reviewee_id)
    .order("created_at", { ascending: false });
}

export async function getReviewBySession(session_id: string, reviewer_id: string) {
  return await supabase
    .from("reviews")
    .select("*")
    .eq("session_id", session_id)
    .eq("reviewer_id", reviewer_id)
    .single();
}

export async function hasUserReviewedSession(
  session_id: string,
  reviewer_id: string
): Promise<boolean> {
  const { data } = await supabase
    .from("reviews")
    .select("id")
    .eq("session_id", session_id)
    .eq("reviewer_id", reviewer_id)
    .single();
  return !!data;
}

