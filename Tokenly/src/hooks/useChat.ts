import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getMessages } from "../services/chatService";
import type { Message } from "../types/session";

export const useChat = (sessionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;

    const mergeMessages = (incoming: Message[]) => {
      setMessages((prev) => {
        const next = [...prev];
        incoming.forEach((message) => {
          if (seenIdsRef.current.has(message.id)) return;
          seenIdsRef.current.add(message.id);
          next.push(message);
        });

        return next.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    };

    const loadMessages = async () => {
      const data = await getMessages(sessionId);

      if (!isMounted) return;

      seenIdsRef.current = new Set();
      const mapped = data.map((msg: any) => ({
        id: msg.id,
        text: msg.message,
        senderId: msg.sender_id,
        senderName: "User",
        timestamp: msg.created_at,
      }));

      mapped.forEach((message) => {
        seenIdsRef.current.add(message.id);
      });

      setMessages(mapped);
    };

    loadMessages();

    const pollId = window.setInterval(() => {
      void getMessages(sessionId).then((data) => {
        if (!isMounted) return;
        mergeMessages(
          data.map((msg: any) => ({
            id: msg.id,
            text: msg.message,
            senderId: msg.sender_id,
            senderName: "User",
            timestamp: msg.created_at,
          }))
        );
      });
    }, 3000);

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

          mergeMessages([
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
      isMounted = false;
      window.clearInterval(pollId);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return messages;
};
