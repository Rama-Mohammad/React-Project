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
  // Flow 2 — help_offer events
  | "help_offer_request_received"   // helper gets this when someone requests their help_offer
  | "help_offer_request_accepted"   // requester gets this when helper accepts
  | "help_offer_request_rejected"   // requester gets this when helper rejects
  // Flow 3 — direct_request events
  | "direct_request_received"       // helper gets this when someone sends them a direct request
  | "direct_request_accepted"       // requester gets this when helper accepts
  | "direct_request_rejected"       // requester gets this when helper rejects
  | "chat_message_received";         // user gets this when they receive a new chat message
  

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
