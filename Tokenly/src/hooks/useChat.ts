import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getMessages } from "../services/chatService";
import type { Message } from "../types/session";

type UseChatOptions = {
  sessionId: string;
  currentUserId: string;
  currentUserName: string;
  otherParticipantId: string;
  otherParticipantName: string;
};

export const useChat = ({
  sessionId,
  currentUserId,
  currentUserName,
  otherParticipantId,
  otherParticipantName,
}: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const appendLocalMessage = (text: string) => {
    const timestamp = new Date().toISOString();
    const optimisticMessage: Message = {
      id: `temp-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      senderId: currentUserId,
      senderName: currentUserName,
      timestamp,
    };

    setMessages((prev) =>
      [...prev, optimisticMessage].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    );
  };

  useEffect(() => {
    if (!sessionId || !currentUserId) return;
    console.log("SESSION DEBUG:", {
  sessionId,
  currentUserId,
});

    let isMounted = true;

    const getSenderName = (senderId: string) => {
      if (senderId === currentUserId) return currentUserName;
      if (senderId === otherParticipantId) return otherParticipantName;
      return "Participant";
    };

    const mapMessage = (msg: any): Message => ({
      id: msg.id,
      text: msg.message,
      senderId: msg.sender_id,
      senderName: getSenderName(msg.sender_id),
      timestamp: msg.created_at,
    });

    const mergeMessages = (nextMessages: Message[]) => {
      setMessages((prev) => {
        const withoutMatchedTemps = [...prev];

        nextMessages.forEach((incoming) => {
          const optimisticIndex = withoutMatchedTemps.findIndex(
            (existing) =>
              existing.id.startsWith("temp-") &&
              existing.senderId === incoming.senderId &&
              existing.text === incoming.text &&
              Math.abs(
                new Date(existing.timestamp).getTime() - new Date(incoming.timestamp).getTime()
              ) < 15000
          );

          if (optimisticIndex >= 0) {
            withoutMatchedTemps.splice(optimisticIndex, 1);
          }
        });

        const merged = new Map<string, Message>();

        [...withoutMatchedTemps, ...nextMessages].forEach((message) => {
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


    const pollTimer = setInterval(() => {
      void loadMessages();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
      supabase.removeChannel(channel);
    };
  }, [sessionId, currentUserId, currentUserName, otherParticipantId, otherParticipantName]);

  return {
    messages,
    appendLocalMessage,
  };
};
