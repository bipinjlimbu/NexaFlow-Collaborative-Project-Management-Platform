"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TasksSkeleton from "@/components/TasksSkeleton";
import { getTasks } from "@/services/taskService";
import type { Task as ApiTask } from "@/types/task";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

interface Task {
    id: number;
    title: string;
    description: string;
    project: string;
    workspace: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
    initials: string;
    dueDate: string;
    dueLabel: string;
    updated: string;
}

const statusStyles: Record<TaskStatus, string> = {
    TODO: "border-slate-700 bg-slate-800/70 text-slate-400",
    IN_PROGRESS: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
    IN_REVIEW: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    DONE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

const statusLabels: Record<TaskStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    DONE: "Done",
};

const priorityStyles: Record<TaskPriority, string> = {
    HIGH: "text-rose-400",
    MEDIUM: "text-amber-400",
    LOW: "text-slate-400",
};

const priorityDots: Record<TaskPriority, string> = {
    HIGH: "bg-rose-400",
    MEDIUM: "bg-amber-400",
    LOW: "bg-slate-500",
};

function mapStatus(status: ApiTask["status"]): TaskStatus {
    switch (status) {
        case "in_progress":
            return "IN_PROGRESS";
        case "review":
            return "IN_REVIEW";
        case "done":
            return "DONE";
        default:
            return "TODO";
    }
}

function mapPriority(priority: ApiTask["priority"]): TaskPriority {
    switch (priority) {
        case "high":
        case "urgent":
            return "HIGH";
        case "medium":
            return "MEDIUM";
        default:
            return "LOW";
    }
}

function getInitials(task: ApiTask) {
    if (!task.assigned_to) {
        return "—";
    }

    const firstInitial = task.assigned_to.first_name?.charAt(0) || "";
    const lastInitial = task.assigned_to.last_name?.charAt(0) || "";

    if (firstInitial || lastInitial) {
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    return task.assigned_to.username?.charAt(0).toUpperCase() || "—";
}

function getAssignee(task: ApiTask) {
    if (!task.assigned_to) {
        return "Unassigned";
    }

    if (task.assigned_to.first_name || task.assigned_to.last_name) {
        return `${task.assigned_to.first_name || ""} ${task.assigned_to.last_name || ""}`.trim();
    }

    return task.assigned_to.username;
}

function formatDueDate(date: string | null) {
    if (!date) {
        return "No due date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function getDueLabel(date: string | null) {
    if (!date) {
        return "No Due Date";
    }

    const today = new Date();
    const dueDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const difference =
        Math.round(
            (dueDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        );

    if (difference === 0) {
        return "Today";
    }

    if (difference === -1) {
        return "Yesterday";
    }

    if (difference === 1) {
        return "Tomorrow";
    }

    return dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

function getUpdatedLabel(date: string) {
    const updatedDate = new Date(date);
    const now = new Date();

    const difference = now.getTime() - updatedDate.getTime();

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    if (days === 1) {
        return "Yesterday";
    }

    if (days < 7) {
        return `${days} days ago`;
    }

    return updatedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function TasksPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [projectFilter, setProjectFilter] = useState("All");

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access");

            if (!token) {
                router.push("/login");
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();

        window.addEventListener("auth-change", checkAuth);

        return () => window.removeEventListener("auth-change", checkAuth);
    }, [router]);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const loadTasks = async () => {
            try {
                const data = await getTasks();

                const mappedTasks: Task[] = data.map((task) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description || "No description",
                    project: task.project.name,
                    workspace: task.project.workspace.name,
                    status: mapStatus(task.status),
                    priority: mapPriority(task.priority),
                    assignee: getAssignee(task),
                    initials: getInitials(task),
                    dueDate: formatDueDate(task.due_date),
                    dueLabel: getDueLabel(task.due_date),
                    updated: getUpdatedLabel(task.updated_at),
                }));

                setTasks(mappedTasks);
            } catch (error) {
                console.error(error);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [isAuthenticated]);

    const projects = [...new Set(tasks.map((task) => task.project))];

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                task.title.toLowerCase().includes(searchValue) ||
                task.description.toLowerCase().includes(searchValue) ||
                task.project.toLowerCase().includes(searchValue) ||
                task.assignee.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusFilter === "All" || task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" || task.priority === priorityFilter;

            const matchesProject =
                projectFilter === "All" || task.project === projectFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesProject
            );
        });
    }, [tasks, search, statusFilter, priorityFilter, projectFilter]);

    const todoCount = tasks.filter((task) => task.status === "TODO").length;
    const progressCount = tasks.filter(
        (task) => task.status === "IN_PROGRESS"
    ).length;
    const reviewCount = tasks.filter(
        (task) => task.status === "IN_REVIEW"
    ).length;
    const completedCount = tasks.filter(
        (task) => task.status === "DONE"
    ).length;

    if (isAuthenticated === null || !isAuthenticated || loading) {
        return <TasksSkeleton />;
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <header className="mb-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400">
                                    Task Management
                                </span>
                                <span className="text-xs text-slate-600">/</span>
                                <span className="font-mono text-[11px] text-slate-500">
                                    NEXAFLOW
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                Tasks
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                Track assignments, priorities, deadlines, and progress across
                                your projects.
                            </p>
                        </div>
                    </div>
                </header>

                <section className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-5">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Total Tasks
                        </span>
                        <div className="mt-3 text-2xl font-semibold text-white">
                            {tasks.length.toString().padStart(2, "0")}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                To Do
                            </span>
                            <span className="h-2 w-2 rounded-full bg-slate-500" />
                        </div>
                        <div className="mt-3 text-2xl font-semibold text-white">
                            {todoCount.toString().padStart(2, "0")}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                In Progress
                            </span>
                            <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        </div>
                        <div className="mt-3 text-2xl font-semibold text-white">
                            {progressCount.toString().padStart(2, "0")}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                In Review
                            </span>
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                        </div>
                        <div className="mt-3 text-2xl font-semibold text-white">
                            {reviewCount.toString().padStart(2, "0")}
                        </div>
                    </div>

                    <div className="col-span-2 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 xl:col-span-1">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                Completed
                            </span>
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        </div>
                        <div className="mt-3 text-2xl font-semibold text-white">
                            {completedCount.toString().padStart(2, "0")}
                        </div>
                    </div>
                </section>

                <section className="mb-8 rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
                    <div className="flex flex-col gap-3 xl:flex-row">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search tasks, projects, or assignees..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/70 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 rounded-lg border border-slate-800 bg-slate-950 px-4 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                            <option value="All">All Status</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="IN_REVIEW">In Review</option>
                            <option value="DONE">Done</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="h-11 rounded-lg border border-slate-800 bg-slate-950 px-4 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                            <option value="All">All Priority</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>

                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="h-11 rounded-lg border border-slate-800 bg-slate-950 px-4 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
                        >
                            <option value="All">All Projects</option>
                            {projects.map((project) => (
                                <option key={project} value={project}>
                                    {project}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Task Stream
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                {filteredTasks.length} tasks matching your filters
                            </p>
                        </div>

                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">
                            {filteredTasks.length.toString().padStart(2, "0")} RESULTS
                        </span>
                    </div>

                    {filteredTasks.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/20 px-6 py-16 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xl text-slate-500">
                                ⌕
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-white">
                                No tasks found
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Try changing your search or filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30">
                            <div className="hidden border-b border-slate-800/80 px-6 py-3 lg:grid lg:grid-cols-[minmax(280px,1.8fr)_1fr_130px_120px_120px] lg:gap-6">
                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">
                                    Task
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">
                                    Project
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">
                                    Status
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">
                                    Priority
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">
                                    Due
                                </span>
                            </div>

                            <div className="divide-y divide-slate-800/80">
                                {filteredTasks.map((task) => (
                                    <Link
                                        key={task.id}
                                        href={`/tasks/${task.id}`}
                                        className="group block px-6 py-5 transition hover:bg-slate-900/70"
                                    >
                                        <div className="grid items-center gap-5 lg:grid-cols-[minmax(280px,1.8fr)_1fr_130px_120px_120px] lg:gap-6">
                                            <div className="min-w-0">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-800 bg-slate-950">
                                                        <span
                                                            className={`h-2 w-2 rounded-full ${priorityDots[task.priority]}`}
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="truncate text-sm font-semibold text-slate-100 transition group-hover:text-indigo-300">
                                                            {task.title}
                                                        </h3>

                                                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                                                            {task.description}
                                                        </p>

                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[9px] font-semibold text-slate-300">
                                                                {task.initials}
                                                            </div>

                                                            <span className="text-[11px] text-slate-500">
                                                                {task.assignee}
                                                            </span>

                                                            <span className="text-slate-700">•</span>

                                                            <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-slate-600">
                                                                {task.workspace}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="hidden min-w-0 lg:block">
                                                <p className="truncate text-xs font-medium text-slate-300">
                                                    {task.project}
                                                </p>
                                                <p className="mt-1 text-[10px] text-slate-600">
                                                    Project
                                                </p>
                                            </div>

                                            <div>
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyles[task.status]}`}
                                                >
                                                    {statusLabels[task.status]}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${priorityDots[task.priority]}`}
                                                />

                                                <span
                                                    className={`text-xs font-medium ${priorityStyles[task.priority]}`}
                                                >
                                                    {task.priority.charAt(0) +
                                                        task.priority.slice(1).toLowerCase()}
                                                </span>
                                            </div>

                                            <div>
                                                <p
                                                    className={`text-xs font-medium ${task.dueLabel === "Today"
                                                        ? "text-rose-400"
                                                        : "text-slate-300"
                                                        }`}
                                                >
                                                    {task.dueLabel}
                                                </p>

                                                <p className="mt-1 text-[10px] text-slate-600">
                                                    {task.dueDate}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}