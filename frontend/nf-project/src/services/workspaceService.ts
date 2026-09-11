import { authFetch } from "@/lib/api";

export interface Workspace {
    id: number;
    name: string;
    description: string | null;
    members_count: number;
    projects_count: number;
    role: "owner" | "admin" | "member";
}

export async function getWorkspaces(): Promise<Workspace[]> {
    const data = await authFetch("/workspaces/");

    return Array.isArray(data)
        ? data
        : data.results || data.workspaces || [];
}