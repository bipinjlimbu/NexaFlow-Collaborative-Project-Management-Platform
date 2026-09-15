import { authFetch } from "@/lib/api";

export interface InvitationUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    phone_number: string | null;
    address: string | null;
    date_joined: string;
    is_active: boolean;
}

export interface InvitationWorkspace {
    id: number;
    name: string;
    description: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    is_archived: boolean;
}

export interface WorkspaceInvitation {
    id: number;
    workspace: InvitationWorkspace;
    invited_user: InvitationUser;
    invited_by: InvitationUser;
    role: "admin" | "member";
    status: "pending" | "accepted" | "declined" | "expired";
    created_at: string;
    expires_at: string;
}

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
