import { authFetch } from "@/lib/api";
import type { User } from "@/types/user";
import type {
    Workspace,
    WorkspaceDetail,
    WorkspaceProject,
    CreateWorkspaceData,
    UpdateWorkspaceData,
} from "@/types/workspace";

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

export async function getWorkspaceProjects(
    workspaceId: number
): Promise<WorkspaceProject[]> {
    const data = await authFetch(
        `/workspaces/${workspaceId}/projects/`
    );

    return Array.isArray(data)
        ? data
        : data.results || data.projects || [];

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

export async function getUsers(): Promise<User[]> {
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

export async function removeWorkspaceMember(
    workspaceId: number,
    userId: number
) {
    return authFetch(
        `/workspaces/${workspaceId}/members/${userId}/remove/`,
        {
            method: "DELETE",
        }
    );
}
