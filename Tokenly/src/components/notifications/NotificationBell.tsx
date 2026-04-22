import { useEffect, useRef, useState } from "react";
import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function NotificationBell({ userId }: { userId: string }) {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    subscribeToLive,
    markAsRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    fetchNotifications(userId);

    const unsubscribe = subscribeToLive(userId);
    return () => unsubscribe();
  }, [userId]);

  // 👇 CLOSE ON OUTSIDE CLICK
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
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
      >
        <FontAwesomeIcon icon={faBell} className="text-slate-700 text-lg" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
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
        />
      )}
    </div>
  );
}
