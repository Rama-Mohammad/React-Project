import { useNavigate } from "react-router-dom";
import type { Notification } from "../../types/notification";

export default function NotificationItem({
    notification,
}: {
    notification: Notification;
}) {
    const navigate = useNavigate();

    function handleClick() {
        if (!notification.related_type || !notification.related_id) return;

        switch (notification.related_type) {
            case "session":
                navigate(`/session/${notification.related_id}`); break;

            case "request":
                navigate(`/requests/${notification.related_id}`);
                break;

            case "offer":
                navigate(`/offers/${notification.related_id}`);
                break;

            case "review":
                navigate(`/reviews/${notification.related_id}`);
                break;

            case "help_offer":
                navigate(`/help-offers/${notification.related_id}`);
                break;

            case "direct_request":
                navigate(`/direct-requests/${notification.related_id}`);
                break;
                
            case "chat":
                navigate(`/chat/${notification.related_id}`);
                break;

            default:
                break;
        }
    }

    return (
        <div
            onClick={handleClick}
            className="p-3 border-b hover:bg-gray-50 cursor-pointer transition"
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