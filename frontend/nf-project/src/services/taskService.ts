import { authFetch } from "@/lib/api";
import type { CreateTaskData, Task } from "@/types/task";

export async function createTask(
    data: CreateTaskData
): Promise<Task> {
    return authFetch("/tasks/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function getTasks(): Promise<Task[]> {
    return authFetch("/tasks/", {
        method: "GET",
    });
}

export async function getTask(id: number): Promise<Task> {
    return authFetch(`/tasks/${id}/`, {
        method: "GET",
    });
}