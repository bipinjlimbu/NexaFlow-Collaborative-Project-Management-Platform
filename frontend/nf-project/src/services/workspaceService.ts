import { authFetch } from "@/lib/api";

export interface WorkspaceMember {
    id: number;
    user: number;
    workspace: number;
    role: "owner" | "admin" | "member";
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
    role?: "owner" | "admin" | "member";
}

export interface CreateWorkspaceData {
    name: string;
    description: string;
}

export async function getWorkspaces(): Promise<Workspace[]> {
    const data = await authFetch("/workspaces/");

    return Array.isArray(data)
        ? data
        : data.results || data.workspaces || [];
}

export async function createWorkspace(
    data: CreateWorkspaceData
): Promise<Workspace> {
    return authFetch("/workspaces/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}