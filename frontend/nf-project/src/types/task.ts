import type { User } from "./user";

export type TaskStatus =
    | "backlog"
    | "todo"
    | "in_progress"
    | "review"
    | "done";

export type TaskPriority =
    | "low"
    | "medium"
    | "high"
    | "urgent";

export interface Task {
    id: number;
    title: string;
    description: string | null;
    project: number;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    assigned_to: User | null;
    created_by: User;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
}

export interface CreateTaskData {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    project: number;
    due_date: string;
    assigned_to: number;
}