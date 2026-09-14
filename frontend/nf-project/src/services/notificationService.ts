import { authFetch } from "@/lib/api";

export interface Notification {
    id: number;
    user: number;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export async function getNotifications(): Promise<Notification[]> {
    const data = await authFetch("/notifications/");

    return Array.isArray(data)
        ? data
        : data.results || data.notifications || [];
}