import { authFetch } from "@/lib/api";
import type { WorkspaceInvitation } from "@/types/invitation";

export async function getInvitations(): Promise<WorkspaceInvitation[]> {
    const data = await authFetch("/invitations/");

    return Array.isArray(data)
        ? data
        : data.results || data.invitations || [];

}

export async function acceptInvitation(
    id: number
): Promise<WorkspaceInvitation> {
    return authFetch(`/invitations/${id}/accept/`, {
        method: "PATCH",
    });
}

export async function declineInvitation(
    id: number
): Promise<WorkspaceInvitation> {
    return authFetch(`/invitations/${id}/decline/`, {
        method: "PATCH",
    });
}
