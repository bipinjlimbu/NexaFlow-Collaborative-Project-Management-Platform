import { authFetch } from "@/lib/api";
import type {
    Project,
    ProjectMember,
    CreateProjectData,
    UpdateProjectData,
} from "@/types/project";
import type { Task } from "@/types/task";
import type { WorkspaceDetailMember } from "@/types/workspace";

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
    return authFetch(`/ projects / ${id}/`);
}

export async function updateProject(
    id: number,
    data: UpdateProjectData
): Promise<Project> {
    return authFetch(`/projects/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteProject(
    id: number
): Promise<void> {
    await authFetch(`/projects/${id}/`, {
        method: "DELETE",
    });
}

export async function getWorkspaceMembers(
    workspaceId: number
): Promise<WorkspaceDetailMember[]> {
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

export async function getTasksInProject(
    projectId: number
): Promise<Task[]> {
    const data = await authFetch(
        `/projects/${projectId}/tasks/`
    );

    return Array.isArray(data)
        ? data
        : data.results || data.tasks || [];
}