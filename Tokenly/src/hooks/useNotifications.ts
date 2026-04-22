import { useCallback, useState } from "react";
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

    const fetchNotifications = useCallback(async (user_id: string) => {
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
    }, []);

    const fetchUnread = useCallback(async (user_id: string) => {
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
    }, []);

    const markAsRead = useCallback(async (id: string) => {
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
    }, []);

    const markAllAsRead = useCallback(async (user_id: string) => {
        setError("");

        const { error } = await markAllNotificationsAsRead(user_id);

        if (error) {
            setError(error.message);
            return false;
        }

        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        return true;
    }, []);

    const removeNotification = useCallback(async (id: string) => {
        setError("");

        const { error } = await deleteNotification(id);

        if (error) {
            setError(error.message);
            return false;
        }

        setNotifications((prev) => prev.filter((n) => n.id !== id));
        return true;
    }, []);

    const subscribeToLive = useCallback((user_id: string) => {
        const channel = subscribeToNotifications(user_id, (newNotification) => {
            setNotifications((prev) => {
                const exists = prev.some((n) => n.id === (newNotification as Notification).id);

                if (exists) return prev;

                return [newNotification as Notification, ...prev];
            });
        });

        return () => {
            void channel.unsubscribe();
        };
    }, []);

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
