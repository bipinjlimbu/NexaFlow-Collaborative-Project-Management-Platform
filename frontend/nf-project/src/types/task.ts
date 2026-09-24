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

export interface TaskProject {
    id: number;
    name: string;
    description: string;
    due_date: string | null;
    priority: string;
    start_date: string | null;
    status: string;
    tasks_count: number;
    members_count: number;
    created_at: string;
    updated_at: string;
    created_by: User;
    workspace: {
        id: number;
        name: string;
        members_count?: number;
        projects_count?: number;
        [key: string]: unknown;
    };
    members: User[];
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    project: TaskProject;
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