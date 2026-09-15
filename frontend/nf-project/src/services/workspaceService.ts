import { authFetch } from "@/lib/api";

export interface WorkspaceMember {
    id: number;
    user: number;
    workspace: number;
    role: "owner" | "admin" | "member";
    joined_at: string;
}

export interface WorkspaceUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    profile_picture: string | null;
    is_active: boolean;
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

export interface WorkspaceDetailMember {
    id: number;
    joined_at: string;
    role: "owner" | "admin" | "member";
    user: WorkspaceUser;
    workspace: number;
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

export interface CreateWorkspaceData {
    name: string;
    description: string;
}

export interface UpdateWorkspaceData {
    name: string;
    description: string;
    is_archived: boolean;
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

export async function getWorkspace(
    id: number
): Promise<WorkspaceDetail> {
    return authFetch(`/workspaces/${id}/`);
}

export async function updateWorkspace(
    id: number,
    data: UpdateWorkspaceData
): Promise<WorkspaceDetail> {
    return authFetch(`/workspaces/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteWorkspace(id: number) {
    return authFetch(`/workspaces/${id}/`, {
        method: "DELETE",
    });
}

export async function getUsers(): Promise<WorkspaceUser[]> {
    const data = await authFetch("/users/");

    return Array.isArray(data)
        ? data
        : data.results || data.users || [];
}

export async function sendWorkspaceInvitation(
    workspaceId: number,
    userId: number,
    role: "admin" | "member"
) {
    return authFetch(`/workspaces/${workspaceId}/invite/`, {
        method: "POST",
        body: JSON.stringify({
            user_id: userId,
            role,
        }),
    });
}

export async function promoteWorkspaceMember(
    workspaceId: number,
    userId: number
) {
    return authFetch(
        `/workspaces/${workspaceId}/members/${userId}/promote/`,
        {
            method: "PATCH",
        }
    );
}

export async function demoteWorkspaceMember(
    workspaceId: number,
    userId: number
) {
    return authFetch(
        `/workspaces/${workspaceId}/members/${userId}/demote/`,
        {
            method: "PATCH",
        }
    );
}