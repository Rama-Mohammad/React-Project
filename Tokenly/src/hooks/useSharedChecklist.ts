// import { useEffect, useRef, useState } from "react";
// import { supabase } from "../lib/supabaseClient";
// import type { ChecklistItem } from "../types/session";

// type ChecklistPayload =
//   | { type: "sync-request"; from: string }
//   | { type: "state"; from: string; updatedAt: number; items: ChecklistItem[] };

// type UseSharedChecklistOptions = {
//   sessionId: string;
//   userId: string;
//   enabled: boolean;
//   initialItems: ChecklistItem[];
// };

// export function useSharedChecklist({
//   sessionId,
//   userId,
//   enabled,
//   initialItems,
// }: UseSharedChecklistOptions) {
//   const [items, setItems] = useState<ChecklistItem[]>(initialItems);
//   const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
//   const lastUpdatedRef = useRef(0);
//   const itemsRef = useRef<ChecklistItem[]>(initialItems);

//   useEffect(() => {
//     itemsRef.current = items;
//   }, [items]);

//   useEffect(() => {
//     if (!enabled || !sessionId || !userId) return;

//     let isMounted = true;
//     setItems(initialItems);
//     itemsRef.current = initialItems;
//     lastUpdatedRef.current = Date.now();

//     const sendPayload = async (payload: ChecklistPayload) => {
//       const channel = channelRef.current;
//       if (!channel) return;

//       await channel.httpSend("agenda", payload);
//     };

//     const channel = supabase.channel(`session-agenda:${sessionId}`, {
//       config: { broadcast: { self: false } },
//     });

//     channelRef.current = channel;
//     channel.on("broadcast", { event: "agenda" }, async ({ payload }) => {
//       const message = payload as ChecklistPayload;
//       if (!isMounted || message.from === userId) return;

//       if (message.type === "sync-request") {
//         await sendPayload({
//           type: "state",
//           from: userId,
//           updatedAt: lastUpdatedRef.current,
//           items: itemsRef.current,
//         });
//         return;
//       }

//       if (message.type === "state" && message.updatedAt >= lastUpdatedRef.current) {
//         lastUpdatedRef.current = message.updatedAt;
//         setItems(message.items);
//         itemsRef.current = message.items;
//       }
//     });

//     channel.subscribe(async (status) => {
//       if (status !== "SUBSCRIBED") return;
//       await sendPayload({ type: "sync-request", from: userId });
//     });

//     return () => {
//       isMounted = false;
//       channelRef.current?.unsubscribe();
//       channelRef.current = null;
//     };
//   }, [enabled, initialItems, sessionId, userId]);

//   const toggleItem = async (itemId: string) => {
//     const nextItems = itemsRef.current.map((item) =>
//       item.id === itemId ? { ...item, completed: !item.completed } : item
//     );
//     await syncLocal(nextItems);
//   };

//   const addItem = async (text: string) => {
//     const nextItems = [
//       ...itemsRef.current,
//       {
//         id: `${Date.now()}-${userId}`,
//         text,
//         completed: false,
//       },
//     ];
//     await syncLocal(nextItems);
//   };

//   const syncLocal = async (nextItems: ChecklistItem[]) => {
//     const updatedAt = Date.now();
//     lastUpdatedRef.current = updatedAt;
//     setItems(nextItems);
//     itemsRef.current = nextItems;

//     const channel = channelRef.current;
//     if (!channel) return;

//     await channel.httpSend("agenda", {
//       type: "state",
//       from: userId,
//       updatedAt,
//       items: nextItems,
//     } satisfies ChecklistPayload);
//   };

//   return {
//     items,
//     toggleItem,
//     addItem,
//   };
// }
