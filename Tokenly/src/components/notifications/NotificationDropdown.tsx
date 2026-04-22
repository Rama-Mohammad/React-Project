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
    <div className="fixed left-3 right-3 top-20 z-50 overflow-hidden rounded-[24px] border border-indigo-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,255,0.98)_100%)] shadow-[0_28px_70px_-34px_rgba(79,70,229,0.4)] backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[22rem] sm:max-w-[calc(100vw-1.5rem)]">
      <div className="hidden sm:block absolute right-4 top-0 h-4 w-4 -translate-y-1/2 rotate-45 border-l border-t border-indigo-100/80 bg-white" />

      <div className="border-b border-slate-100/90 px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">Notifications</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {notifications.length > 0 ? `${notifications.length} updates waiting` : "You are all caught up"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
            aria-label="Close notifications"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      </div>

      <div className="max-h-[min(24rem,calc(100vh-7rem))] overflow-y-auto p-2">
        {loading ? (
          <p className="rounded-2xl px-3 py-8 text-center text-sm text-slate-500">
            Loading notifications...
          </p>
        ) : error ? (
          <p className="rounded-2xl bg-rose-50 px-3 py-8 text-center text-sm text-rose-600">
            {error}
          </p>
        ) : notifications.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-3 py-8 text-center text-sm text-slate-500">
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
    </div>
  );
}
