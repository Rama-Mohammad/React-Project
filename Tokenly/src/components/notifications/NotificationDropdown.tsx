import NotificationItem from "./NotificationItem";
import type { Notification } from "../../types/notification";

export default function NotificationDropdown({
  notifications,
  onNotificationRead,
  onClose,
  loading,
  error,
}: {
  notifications: Notification[];
  onNotificationRead: (id: string) => void | Promise<void>;
  onClose: () => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border max-h-96 overflow-y-auto z-50">
      <div className="p-3 border-b font-semibold">
        Notifications
      </div>

      {loading ? (
        <p className="p-4 text-sm text-gray-500">
          Loading notifications...
        </p>
      ) : error ? (
        <p className="p-4 text-sm text-rose-600">
          {error}
        </p>
      ) : notifications.length === 0 ? (
        <p className="p-4 text-sm text-gray-500">
          No notifications yet
        </p>
      ) : (
        notifications.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onRead={onNotificationRead}
            onClose={onClose}
          />
        ))
      )}
    </div>
  );
}
