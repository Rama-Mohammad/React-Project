import { useEffect, useRef, useState } from "react";
import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function NotificationBell({ userId }: { userId: string }) {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    subscribeToLive,
    markAsRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    void fetchNotifications(userId);

    const unsubscribe = subscribeToLive(userId);
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const intervalId = window.setInterval(() => {
      void fetchNotifications(userId);
    }, 15000);

    const handleFocus = () => {
      void fetchNotifications(userId);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [userId, fetchNotifications]);

  useEffect(() => {
    if (!open || !userId) return;
    void fetchNotifications(userId);
  }, [open, userId, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-700 shadow-[0_14px_30px_-28px_rgba(79,70,229,0.6)] transition hover:border-indigo-200 hover:bg-white hover:text-slate-900"
        aria-label={open ? "Close notifications" : "Open notifications"}
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={faBell} className="text-slate-700 text-lg" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[1.2rem] rounded-full bg-[linear-gradient(135deg,#ef4444_0%,#f97316_100%)] px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-white shadow-[0_10px_18px_-10px_rgba(239,68,68,0.9)]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          onNotificationRead={async (id) => {
            await markAsRead(id);
          }}
          onClose={() => setOpen(false)}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

