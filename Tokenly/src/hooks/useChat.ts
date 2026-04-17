import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getMessages } from "../services/chatService";
import type { Message } from "../types/session";

type UseChatOptions = {
  sessionId: string;
  currentUserId: string;
  currentUserName: string;
  otherParticipantName: string;
};

export const useChat = ({
  sessionId,
  currentUserId,
  currentUserName,
  otherParticipantName,
}: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;

    const mapMessage = (msg: any): Message => ({
      id: msg.id,
      text: msg.message,
      senderId: msg.sender_id,
      senderName: msg.sender_id === currentUserId ? currentUserName : otherParticipantName,
      timestamp: msg.created_at,
    });

    const mergeMessages = (nextMessages: Message[]) => {
      setMessages((prev) => {
        const merged = new Map<string, Message>();

        [...prev, ...nextMessages].forEach((message) => {
          merged.set(message.id, message);
        });

        return Array.from(merged.values()).sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    };

    const loadMessages = async () => {
      const data = await getMessages(sessionId);
      if (!isMounted) return;

      mergeMessages(data.map(mapMessage));
    };

    void loadMessages();

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
          mergeMessages([mapMessage(msg)]);
        }
      )
      .subscribe();

    const pollTimer = setInterval(() => {
      void loadMessages();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
      supabase.removeChannel(channel);
    };
  }, [sessionId, currentUserId, currentUserName, otherParticipantName]);

  return messages;
};
