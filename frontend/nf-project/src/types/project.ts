import type { User } from "./user";

export type ProjectStatus =
    | "planning"
    | "active"
    | "inactive"
    | "archived";

export type ProjectPriority =
    | "low"
    | "medium"
    | "high"
    | "urgent";

export interface ProjectMember {
    id: number;
    project: number;
    user: User;
    joined_at: string;
}

export interface ProjectWorkspace {
    id: number;
    name: string;
    description: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    is_archived: boolean;
    members: ProjectWorkspaceMember[];
    members_count: number;
    projects_count: number;
}

export interface ProjectWorkspaceMember {
    id: number;
    user: User;
    workspace: number;
    role: "owner" | "admin" | "member";
    joined_at: string;
}

export interface Project {
    id: number;
    name: string;
    description: string | null;
    workspace: ProjectWorkspace;
    status: ProjectStatus;
    priority: ProjectPriority;
    start_date: string | null;
    due_date: string | null;
    created_by: User;
    created_at: string;
    updated_at: string;
    members: ProjectMember[];
    members_count: number;
    tasks_count: number;
}

export interface CreateProjectData {
    name: string;
    description: string;
    workspace_id: number;
    start_date: string;
    due_date: string;
}
