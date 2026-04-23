import { useNavigate } from "react-router-dom";
import type { Notification } from "../../types/notification";

export default function NotificationItem({
  notification,
  onRead,
  onClose,
}: {
  notification: Notification;
  onRead: (id: string) => void | Promise<void>;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  function getDestination() {
    switch (notification.type) {
      case "session_completed":
        return "/sessions?filter=completed";
      case "session_starting":
        return notification.related_id ? `/session/${notification.related_id}` : "/sessions?filter=active";
      case "offer_accepted":
      case "offer_rejected":
      case "help_offer_request_received":
        return "/my-offers";
      case "direct_request_received":
      case "direct_request_rejected":
        return "/dashboard?section=inbox";
      case "direct_request_accepted":
      case "help_offer_request_accepted":
        return "/sessions?filter=upcoming";
      case "help_offer_request_rejected":
      case "review_received":
      case "credits_earned":
      case "credits_spent":
        return "/activity";
      case "request_expired":
        return notification.related_id ? `/requests/${notification.related_id}` : "/dashboard?section=requests";
      case "chat_message_received":
        return "/dashboard?section=inbox";
      default:
        break;
    }

    if (notification.related_type === "request" && notification.related_id) {
      return `/requests/${notification.related_id}`;
    }

    if (notification.related_type === "offer" && notification.related_id) {
      return "/my-offers";
    }

    if (notification.related_type === "session" && notification.related_id) {
      return `/session/${notification.related_id}`;
    }

    if (notification.related_type === "review") {
      return "/activity";
    }

    return "/dashboard";
  }

  async function handleClick() {
    if (!notification.is_read) {
      await onRead(notification.id);
    }

    onClose();
    navigate(getDestination());
  }

  return (
    <div
      onClick={() => {
        void handleClick();
      }}
      className={[
        "cursor-pointer rounded-2xl border px-3 py-3 transition",
        notification.is_read
          ? "border-transparent bg-white/70 hover:border-slate-200 hover:bg-white"
          : "border-indigo-100 bg-[linear-gradient(135deg,#eef2ff_0%,#f8faff_100%)] shadow-[0_12px_24px_-22px_rgba(79,70,229,0.7)] hover:border-indigo-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            {notification.title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {notification.message}
          </p>
        </div>

        {!notification.is_read && (
          <span className="mt-0.5 inline-flex shrink-0 rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            New
          </span>
        )}
      </div>
    </div>
  );
}

