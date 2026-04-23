import { supabase } from "../lib/supabaseClient";

export const getChecklistItems = async (sessionId: string) => {
  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const addChecklistItem = async (
  sessionId: string,
  text: string
) => {
  const { data, error } = await supabase
    .from("checklist_items")
    .insert({
      session_id: sessionId,
      text,
      completed: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateChecklistItem = async (
  id: string,
  updates: { text?: string; completed?: boolean }
) => {
  const { data, error } = await supabase
    .from("checklist_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};


export const deleteChecklistItem = async (id: string) => {
  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

