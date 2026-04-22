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
      className="cursor-pointer border-b p-3 transition hover:bg-gray-50"
    >
      <p className="text-sm font-medium">
        {notification.title}
      </p>

      <p className="text-xs text-gray-600">
        {notification.message}
      </p>

      {!notification.is_read && (
        <span className="text-xs text-blue-500">New</span>
      )}
    </div>
  );
}
