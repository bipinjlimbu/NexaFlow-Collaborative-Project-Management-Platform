import { authFetch } from "@/lib/api";

export interface Project {
    id: number;
    name: string;
    description: string;
    workspace: number;
    start_date: string | null;
    due_date: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CreateProjectData {
    name: string;
    description: string;
    workspace_id: number;
    start_date: string;
    due_date: string;
}

export async function createProject(
    data: CreateProjectData
): Promise<Project> {
    return authFetch("/projects/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}