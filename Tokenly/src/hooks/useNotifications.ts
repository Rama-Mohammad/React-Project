import {useState } from "react";
import type { Notification, UseNotificationsResult } from "../types/notification";
import {
    getNotificationsByUser,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    subscribeToNotifications,
} from "../services/notificationService";

export default function useNotifications(): UseNotificationsResult {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    async function fetchNotifications(user_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getNotificationsByUser(user_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setNotifications(data ?? []);
        setLoading(false);
    }

    async function fetchUnread(user_id: string) {
        setLoading(true);
        setError("");

        const { data, error } = await getUnreadNotifications(user_id);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setNotifications(data ?? []);
        setLoading(false);
    }

    async function markAsRead(id: string) {
        setError("");

        const { error } = await markNotificationAsRead(id);

        if (error) {
            setError(error.message);
            return false;
        }

        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        return true;
    }

    async function markAllAsRead(user_id: string) {
        setError("");

        const { error } = await markAllNotificationsAsRead(user_id);

        if (error) {
            setError(error.message);
            return false;
        }

        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        return true;
    }

    async function removeNotification(id: string) {
        setError("");

        const { error } = await deleteNotification(id);

        if (error) {
            setError(error.message);
            return false;
        }

        setNotifications((prev) => prev.filter((n) => n.id !== id));
        return true;
    }

    function subscribeToLive(user_id: string) {
        const channel = subscribeToNotifications(user_id, (newNotification) => {
            setNotifications((prev) => [newNotification as Notification, ...prev]);
        });

        return () => {
            void channel.unsubscribe();
        };
    }

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnread,
        markAsRead,
        markAllAsRead,
        removeNotification,
        subscribeToLive,
    };
}
