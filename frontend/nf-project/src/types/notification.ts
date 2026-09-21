export interface Notification {
    id: number;
    user: number;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}
