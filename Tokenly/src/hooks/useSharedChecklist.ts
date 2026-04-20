import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ChecklistItem } from "../types/session";
import {
  getChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../services/checklistService";

type ChecklistPayload =
  | { type: "sync-request"; from: string }
  | { type: "state"; from: string; updatedAt: number; items: ChecklistItem[] };

type UseSharedChecklistOptions = {
  sessionId: string;
  userId: string;
  enabled: boolean;
  initialItems: ChecklistItem[];
};

export function useSharedChecklist({
  sessionId,
  userId,
  enabled,
  initialItems,
}: UseSharedChecklistOptions) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastUpdatedRef = useRef(0);
  const itemsRef = useRef<ChecklistItem[]>(initialItems);
  

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // ----------------------------
  // INIT + SYNC
  // ----------------------------
  useEffect(() => {
    if (!enabled || !sessionId || !userId) return;

    let isMounted = true;

    const sendPayload = async (payload: ChecklistPayload) => {
      const channel = channelRef.current;
      if (!channel) return;

      await channel.send({
        type: "broadcast",
        event: "agenda",
        payload,
      });
    };

    const loadFromDB = async () => {
      try {
        const data = await getChecklistItems(sessionId);

        if (!isMounted || !data) return;

        setItems(data);
        itemsRef.current = data;
        lastUpdatedRef.current = Date.now();
      } catch (err) {
        console.error("Failed to load checklist:", err);
      }
    };

    loadFromDB();

    const channel = supabase.channel(`session-agenda:${sessionId}`, {
      config: { broadcast: { self: false } },
    });

    channelRef.current = channel;

    channel.on("broadcast", { event: "agenda" }, async ({ payload }) => {
      const message = payload as ChecklistPayload;

      if (!isMounted || message.from === userId) return;

      if (message.type === "sync-request") {
        await sendPayload({
          type: "state",
          from: userId,
          updatedAt: lastUpdatedRef.current,
          items: itemsRef.current,
        });
        return;
      }

      if (
        message.type === "state" &&
        message.updatedAt >= lastUpdatedRef.current
      ) {
        lastUpdatedRef.current = message.updatedAt;
        setItems(message.items);
        itemsRef.current = message.items;
      }
    });

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;

      await sendPayload({ type: "sync-request", from: userId });
    });

    return () => {
      isMounted = false;
      channelRef.current?.unsubscribe();
      channelRef.current = null;
    };
  }, [enabled, sessionId, userId]);

  // ----------------------------
  // ACTIONS (DB + SYNC)
  // ----------------------------

  const syncLocal = async (nextItems: ChecklistItem[]) => {
    const updatedAt = Date.now();

    setItems(nextItems);
    itemsRef.current = nextItems;
    lastUpdatedRef.current = updatedAt;

    const channel = channelRef.current;
    if (!channel) return;

    await channel.send({
      type: "broadcast",
      event: "agenda",
      payload: {
        type: "state",
        from: userId,
        updatedAt,
        items: nextItems,
      } satisfies ChecklistPayload,
    });
  };

  // ADD
  const addItem = async (text: string) => {
    const newItem = await addChecklistItem(sessionId, text);

    const nextItems = [...itemsRef.current, newItem];
    await syncLocal(nextItems);
  };

  // TOGGLE
  const toggleItem = async (itemId: string) => {
    const item = itemsRef.current.find((i) => i.id === itemId);
    if (!item) return;

    const updated = await updateChecklistItem(itemId, {
      completed: !item.completed,
    });

    const nextItems = itemsRef.current.map((i) =>
      i.id === itemId ? updated : i
    );

    await syncLocal(nextItems);
  };

  // EDIT
  const editItem = async (id: string, text: string) => {
    const updated = await updateChecklistItem(id, { text });

    const nextItems = itemsRef.current.map((i) =>
      i.id === id ? updated : i
    );

    await syncLocal(nextItems);
  };

  // DELETE
  const removeItem = async (id: string) => {
    await deleteChecklistItem(id);

    const nextItems = itemsRef.current.filter((i) => i.id !== id);
    await syncLocal(nextItems);
  };

  return {
    items,
    addItem,
    toggleItem,
    editItem,
    removeItem,
  };
}