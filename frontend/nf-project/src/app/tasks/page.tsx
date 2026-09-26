"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    Circle,
    Clock3,
    ListFilter,
    Search,
} from "lucide-react";
import TasksSkeleton from "@/components/TasksSkeleton";
import { getTasks } from "@/services/taskService";
import type { Task as ApiTask } from "@/types/task";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
type TaskPriority = "HIGH" | "MEDIUM" | "LOW" | "URGENT";

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
    TODO: "border-slate-700 bg-slate-800/70 text-slate-300",
    IN_PROGRESS: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
    IN_REVIEW: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    DONE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
};

const statusLabels: Record<TaskStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    DONE: "Done",
};

const priorityStyles: Record<TaskPriority, string> = {
    URGENT: "text-rose-400",
    HIGH: "text-orange-400",
    MEDIUM: "text-amber-400",
    LOW: "text-slate-400",
};

const priorityDots: Record<TaskPriority, string> = {
    URGENT: "bg-rose-400",
    HIGH: "bg-orange-400",
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
        case "urgent":
            return "URGENT";
        case "high":
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
    const [isAuthenticated, setIsAuthenticated] =
        useState<boolean | null>(null);
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

        return () =>
            window.removeEventListener("auth-change", checkAuth);
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
                statusFilter === "All" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            const matchesProject =
                projectFilter === "All" ||
                task.project === projectFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesProject
            );
        });
    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter,
        projectFilter,
    ]);

    const todoCount = tasks.filter(
        (task) => task.status === "TODO"
    ).length;

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
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <header className="mb-8">
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                    Task Management
                                </span>

                                <span className="text-xs text-slate-700">
                                    /
                                </span>

                                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                                    NexaFlow
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                                Tasks
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                Keep track of assignments, deadlines, priorities,
                                and progress across your projects.
                            </p>
                        </div>
                    </div>
                </header>

                <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Total
                            </span>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                <ListFilter className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-4 text-2xl font-semibold text-slate-50">
                            {tasks.length.toString().padStart(2, "0")}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            All tasks
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                To Do
                            </span>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                <Circle className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-4 text-2xl font-semibold text-slate-50">
                            {todoCount.toString().padStart(2, "0")}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            Not started
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                In Progress
                            </span>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Clock3 className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-4 text-2xl font-semibold text-slate-50">
                            {progressCount.toString().padStart(2, "0")}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            Currently active
                        </p>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:col-span-2 sm:p-5 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Completed
                            </span>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-4 text-2xl font-semibold text-slate-50">
                            {completedCount.toString().padStart(2, "0")}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            Finished tasks
                        </p>
                    </div>
                </section>

                <section className="mb-8 rounded-2xl border border-slate-800 bg-[#111827] p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2 px-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <ListFilter className="h-3.5 w-3.5" />
                        </div>

                        <div>
                            <h2 className="text-xs font-semibold text-slate-200">
                                Find tasks
                            </h2>

                            <p className="hidden text-[10px] text-slate-500 sm:block">
                                Search and filter your task list
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                            <input
                                type="text"
                                placeholder="Search tasks, projects, or assignees..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 w-full rounded-xl border border-slate-800 bg-[#020617] pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-slate-800 bg-[#020617] px-3.5 text-sm text-slate-300 outline-none transition hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 [color-scheme:dark]"
                        >
                            <option value="All">All Status</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">
                                In Progress
                            </option>
                            <option value="IN_REVIEW">
                                In Review
                            </option>
                            <option value="DONE">Done</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(e.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-slate-800 bg-[#020617] px-3.5 text-sm text-slate-300 outline-none transition hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 [color-scheme:dark]"
                        >
                            <option value="All">All Priority</option>
                            <option value="URGENT">Urgent</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>

                        <select
                            value={projectFilter}
                            onChange={(e) =>
                                setProjectFilter(e.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-slate-800 bg-[#020617] px-3.5 text-sm text-slate-300 outline-none transition hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 [color-scheme:dark]"
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
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-50">
                                Task list
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                {filteredTasks.length}{" "}
                                {filteredTasks.length === 1
                                    ? "task"
                                    : "tasks"}{" "}
                                matching your filters
                            </p>
                        </div>

                        <span className="self-start rounded-lg border border-slate-800 bg-[#111827] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:self-auto">
                            {filteredTasks.length
                                .toString()
                                .padStart(2, "0")}{" "}
                            Results
                        </span>
                    </div>

                    {filteredTasks.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#111827]/50 px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-[#0F172A] text-slate-500">
                                <Search className="h-5 w-5" />
                            </div>

                            <h3 className="mt-5 text-sm font-semibold text-slate-100">
                                No tasks found
                            </h3>

                            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
                                Try changing your search terms or filters
                                to find what you're looking for.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                            <div className="hidden border-b border-slate-800 bg-[#0F172A]/70 px-5 py-3 lg:grid lg:grid-cols-[minmax(280px,1.8fr)_minmax(140px,1fr)_130px_110px_120px] lg:gap-5 xl:px-6">
                                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Task
                                </span>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Project
                                </span>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Status
                                </span>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Priority
                                </span>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Due
                                </span>
                            </div>

                            <div className="divide-y divide-slate-800">
                                {filteredTasks.map((task) => (
                                    <Link
                                        key={task.id}
                                        href={`/tasks/${task.id}`}
                                        className="group block px-4 py-5 transition hover:bg-[#0F172A]/70 sm:px-5 lg:px-5 xl:px-6"
                                    >
                                        <div className="grid gap-4 lg:grid-cols-[minmax(280px,1.8fr)_minmax(140px,1fr)_130px_110px_120px] lg:items-center lg:gap-5">
                                            <div className="min-w-0">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-[#020617]">
                                                        <span
                                                            className={`h-2 w-2 rounded-full ${priorityDots[task.priority]}`}
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate text-sm font-semibold text-slate-100 transition group-hover:text-indigo-300">
                                                            {task.title}
                                                        </h3>

                                                        <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500">
                                                            {task.description}
                                                        </p>

                                                        <div className="mt-3 flex min-w-0 items-center gap-2">
                                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[9px] font-semibold text-slate-300">
                                                                {task.initials}
                                                            </div>

                                                            <span className="max-w-[150px] truncate text-[11px] text-slate-400">
                                                                {task.assignee}
                                                            </span>

                                                            <span className="text-slate-700">
                                                                •
                                                            </span>

                                                            <span className="max-w-[140px] truncate text-[10px] uppercase tracking-[0.06em] text-slate-600">
                                                                {task.workspace}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-800 pt-3 lg:block lg:border-0 lg:pt-0">
                                                <span className="text-[10px] uppercase tracking-[0.1em] text-slate-600 lg:hidden">
                                                    Project
                                                </span>

                                                <p className="max-w-[180px] truncate text-xs font-medium text-slate-300 lg:max-w-none">
                                                    {task.project}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between lg:block">
                                                <span className="text-[10px] uppercase tracking-[0.1em] text-slate-600 lg:hidden">
                                                    Status
                                                </span>

                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyles[task.status]}`}
                                                >
                                                    {statusLabels[task.status]}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between lg:block">
                                                <span className="text-[10px] uppercase tracking-[0.1em] text-slate-600 lg:hidden">
                                                    Priority
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${priorityDots[task.priority]}`}
                                                    />

                                                    <span
                                                        className={`text-xs font-medium ${priorityStyles[task.priority]}`}
                                                    >
                                                        {task.priority
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            task.priority
                                                                .slice(1)
                                                                .toLowerCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between lg:block">
                                                <span className="text-[10px] uppercase tracking-[0.1em] text-slate-600 lg:hidden">
                                                    Due
                                                </span>

                                                <div className="text-right lg:text-left">
                                                    <p
                                                        className={`text-xs font-medium ${task.dueLabel ===
                                                            "Today"
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