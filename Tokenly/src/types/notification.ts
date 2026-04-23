export type NotificationType =
  | "offer_received"
  | "offer_accepted"
  | "offer_rejected"
  | "session_starting"
  | "session_completed"
  | "review_received"
  | "credits_earned"
  | "credits_spent"
  | "request_expired"
  | "help_offer_request_received"
  | "help_offer_request_accepted"
  | "help_offer_request_rejected"
  | "direct_request_received"
  | "direct_request_accepted"
  | "direct_request_rejected"
  | "chat_message_received";
  

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: string;
  related_type?: "session" | "request" | "offer" | "review" | "help_offer" | "direct_request" | "chat";
  is_read: boolean;
  created_at: string;
};

export type UseNotificationsResult = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string;
  fetchNotifications: (user_id: string) => Promise<void>;
  fetchUnread: (user_id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: (user_id: string) => Promise<boolean>;
  removeNotification: (id: string) => Promise<boolean>;
  subscribeToLive: (user_id: string) => () => void;
};


