import { supabase } from "../lib/supabaseClient";
import type { Message } from "../types/session";

export const getMessages = async (sessionId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("session_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
};


export const sendMessage = async (
  sessionId: string,
  senderId: string,
  message: string
) => {
  const { error } = await supabase.from("session_messages").insert({
    session_id: sessionId,
    sender_id: senderId,
    message,
  });

  if (error) throw error;
};

