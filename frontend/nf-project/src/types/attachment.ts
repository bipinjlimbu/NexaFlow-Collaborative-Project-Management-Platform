import type { User } from "./user";

export interface Attachment {
    id: number;
    task: number;
    file: string;
    file_name: string;
    file_size: number;
    uploaded_by: User;
    uploaded_at: string;
}
