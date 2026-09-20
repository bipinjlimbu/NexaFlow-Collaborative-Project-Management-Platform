import { authFetch } from "@/lib/api";

export interface ProjectUser {
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

export interface ProjectMember {
    id: number;
    user: ProjectUser;
    role: "owner" | "admin" | "member";
    joined_at: string;
    workspace: number;
}

export interface WorkspaceMemberUser {
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

export interface WorkspaceMember {
    id: number;
    user: WorkspaceMemberUser;
    role?: "owner" | "admin" | "member";
    joined_at?: string;
    workspace?: number;
}

export interface ProjectWorkspace {
    id: number;
    name: string;
    description: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    is_archived: boolean;
    members: ProjectMember[];
    members_count: number;
    projects_count: number;
}

export interface Project {
    id: number;
    name: string;
    description: string | null;
    workspace: ProjectWorkspace;
    created_by: ProjectUser;
    status: "planning" | "active" | "inactive" | "archived";
    priority: "low" | "medium" | "high" | "urgent";
    start_date: string | null;
    due_date: string | null;
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

export async function getProjects(): Promise<Project[]> {
    const data = await authFetch("/projects/");

    return Array.isArray(data)
        ? data
        : data.results || data.projects || [];
}

export async function createProject(
    data: CreateProjectData
): Promise<Project> {
    return authFetch("/projects/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function getProject(
    id: number
): Promise<Project> {
    return authFetch(`/projects/${id}/`);
}

export async function getWorkspaceMembers(
    workspaceId: number
): Promise<WorkspaceMember[]> {
    const data = await authFetch(
        `/projects/workspace/${workspaceId}/members/`
    );

    return Array.isArray(data)
        ? data
        : data.results || data.members || [];
}

export async function getProjectMembers(
    projectId: number
): Promise<ProjectMember[]> {
    const data = await authFetch(
        `/projects/${projectId}/members/`
    );

    return Array.isArray(data)
        ? data
        : data.results || data.members || [];
}

export async function addMemberToProject(
    projectId: number,
    userId: number
): Promise<{ message: string }> {
    return authFetch(
        `/projects/${projectId}/members/${userId}/add/`,
        {
            method: "PATCH",
        }
    );
}