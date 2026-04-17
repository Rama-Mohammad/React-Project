import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getMessages } from "../services/chatService";
import type { Message } from "../types/session";

export const useChat = (sessionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!sessionId) return;

    const loadMessages = async () => {
      const data = await getMessages(sessionId);

      setMessages(
        data.map((msg: any) => ({
          id: msg.id,
          text: msg.message,
          senderId: msg.sender_id,
          senderName: "User",
          timestamp: msg.created_at,
        }))
      );
    };

    loadMessages();

    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "session_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const msg: any = payload.new;

          setMessages((prev) => [
            ...prev,
            {
              id: msg.id,
              text: msg.message,
              senderId: msg.sender_id,
              senderName: "User",
              timestamp: msg.created_at,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return messages;
};
