import type { User } from "./user";

export type WorkspaceRole = "owner" | "admin" | "member";

export interface WorkspaceMember {
    id: number;
    user: number;
    workspace: number;
    role: WorkspaceRole;
    joined_at: string;
}

export interface WorkspaceDetailMember {
    id: number;
    user: User;
    workspace: number;
    role: WorkspaceRole;
    joined_at: string;
}

export interface Workspace {
    id: number;
    name: string;
    description: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    is_archived: boolean;
    members: WorkspaceMember[];
    members_count: number;
    projects_count: number;
    role?: WorkspaceRole;
}

export interface WorkspaceDetail {
    id: number;
    name: string;
    description: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    is_archived: boolean;
    members: WorkspaceDetailMember[];
    members_count: number;
    projects_count: number;
}

export interface WorkspaceProject {
    id: number;
    name: string;
    description: string | null;
    workspace: number;
    status: "planning" | "active" | "inactive" | "archived";
    priority: "low" | "medium" | "high" | "urgent";
    start_date: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateWorkspaceData {
    name: string;
    description: string;
}

export interface UpdateWorkspaceData {
    name: string;
    description: string;
    is_archived: boolean;
}
