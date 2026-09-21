import type { User } from "./user";

export interface Comment {
    id: number;
    task: number;
    user: User;
    content: string;
    created_at: string;
    updated_at: string;
}
