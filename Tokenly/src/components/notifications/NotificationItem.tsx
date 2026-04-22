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
    if (notification.related_type === "session" && notification.related_id) {
      return `/session/${notification.related_id}`;
    }

    if (notification.type === "help_offer_request_received") {
      return "/my-offers";
    }

    if (notification.type === "direct_request_received" || notification.type === "direct_request_rejected") {
      return "/dashboard";
    }

    if (notification.related_type === "request" && notification.related_id) {
      return `/requests/${notification.related_id}`;
    }

    if (notification.related_type === "offer" && notification.related_id) {
      return `/offers/${notification.related_id}`;
    }

    if (notification.related_type === "chat" && notification.related_id) {
      return `/chat/${notification.related_id}`;
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
