import { supabase } from "../lib/supabaseClient";
import type { NotificationType } from "../types/notification";

export async function getNotificationsByUser(user_id: string) {
  const result = await supabase
    .from("notifications")
    .select("id, user_id, type, title, message, is_read, related_id, related_type, created_at")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (result.error) {
    console.error("[notifications] getNotificationsByUser failed", {
      user_id,
      error: result.error,
    });
  }

  return result;
}

export async function getUnreadNotifications(user_id: string) {
  return await supabase
    .from("notifications")
    .select("id, user_id, type, title, message, is_read, related_id, related_type, created_at")
    .eq("user_id", user_id)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(30);
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
  related_type?: "session" | "request" | "offer" | "review" | "help_offer" | "direct_request" | "chat";
}) {
  const result = await supabase
    .from("notifications")
    .insert({ ...data, is_read: false })
    .select()
    .single();

  if (result.error) {
    console.error("[notifications] createNotification failed", {
      payload: data,
      error: result.error,
    });
  } else {
    console.log("[notifications] createNotification succeeded", {
      id: result.data?.id,
      user_id: data.user_id,
      type: data.type,
    });
  }

  return result;
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
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || error) {
        console.error("[notifications] realtime subscribe failed", {
          user_id,
          status,
          error,
        });
      }
    });
}
