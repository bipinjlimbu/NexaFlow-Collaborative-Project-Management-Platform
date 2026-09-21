import type { User } from "./user";

export type InvitationRole = "admin" | "member";

export type InvitationStatus =
    | "pending"
    | "accepted"
    | "declined"
    | "expired";

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
    invited_user: User | null;
    invited_by: User;
    role: InvitationRole;
    status: InvitationStatus;
    created_at: string;
    expires_at: string;
}
