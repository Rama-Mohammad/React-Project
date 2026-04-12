import { supabase } from "../lib/supabaseClient";
import type { NotificationType } from "../types/notification";

export async function getNotificationsByUser(user_id: string) {
  return await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
}

export async function getUnreadNotifications(user_id: string) {
  return await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .eq("is_read", false)
    .order("created_at", { ascending: false });
}

export async function markNotificationAsRead(id: string) {
  return await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single();
}

export async function markAllNotificationsAsRead(user_id: string) {
  return await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user_id)
    .eq("is_read", false);
}

export async function createNotification(data: {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: string;
  related_type?: "session" | "request" | "offer" | "review" | "help_offer" | "direct_request";
}) {
  return await supabase
    .from("notifications")
    .insert({ ...data, is_read: false })
    .select()
    .single();
}


export async function deleteNotification(id: string) {
  return await supabase.from("notifications").delete().eq("id", id);
}

export function subscribeToNotifications(
  user_id: string,
  callback: (notification: unknown) => void
) {
  return supabase
    .channel(`notifications:${user_id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user_id}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
}