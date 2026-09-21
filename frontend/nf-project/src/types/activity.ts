import type { User } from "./user";

export interface Activity {
    id: number;
    workspace: number;
    user: User;
    action: string;
    description: string | null;
    project: number | null;
    task: number | null;
    created_at: string;
}
