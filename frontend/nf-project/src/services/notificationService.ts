import { authFetch } from "@/lib/api";
import type { Notification } from "@/types/notification";

export async function getNotifications(): Promise<Notification[]> {
    const data = await authFetch("/notifications/");

    return Array.isArray(data)
        ? data
        : data.results || data.notifications || [];

}

export async function markNotificationAsRead(
    id: number
): Promise<Notification> {
    return authFetch(`/notifications/${id}/`, {
        method: "PATCH",
    });
}

export async function deleteNotification(id: number) {
    return authFetch(`/notifications/${id}/`, {
        method: "DELETE",
    });
}
