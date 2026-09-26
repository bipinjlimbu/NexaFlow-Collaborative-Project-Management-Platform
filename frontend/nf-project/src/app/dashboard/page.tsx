"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { getWorkspaces } from "@/services/workspaceService";
import { getProjects } from "@/services/projectService";
import { getTasks } from "@/services/taskService";
import type { Workspace } from "@/types/workspace";
import type { Project as ProjectData } from "@/types/project";
import type { Task as TaskData } from "@/types/task";

interface Project {
    id: number;
    name: string;
    workspace: string;
    completedTasks: number;
    totalTasks: number;
    status: string;
}

interface Task {
    id: number;
    title: string;
    project: string;
    workspace: string;
    status: "DONE" | "IN_PROGRESS" | "IN_REVIEW" | "TODO";
    dueDate: string;
}

function mapProjectStatus(
    status: ProjectData["status"]
): string {
    switch (status) {
        case "active":
            return "Active";
        case "inactive":
            return "In Review";
        case "archived":
            return "Completed";
        default:
            return "Planning";
    }
}

function mapTaskStatus(
    status: TaskData["status"]
): Task["status"] {
    switch (status) {
        case "done":
            return "DONE";
        case "in_progress":
            return "IN_PROGRESS";
        case "review":
            return "IN_REVIEW";
        default:
            return "TODO";
    }
}

function formatDueDate(date: string | null) {
    if (!date) {
        return "No due date";
    }

    const dueDate = new Date(`${date}T00:00:00`);
    const today = new Date();

    const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const dueDateStart = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
    );

    if (dueDateStart.getTime() === todayStart.getTime()) {
        return "Today";
    }

    if (dueDateStart.getTime() === tomorrowStart.getTime()) {
        return "Tomorrow";
    }

    return dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export default function DashboardPage() {
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [recentTasks, setRecentTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function checkAuth() {
            const token = localStorage.getItem("access");

            if (!token) {
                setIsAuthenticated(false);
                router.replace("/login");
            } else {
                setIsAuthenticated(true);
            }
        }

        checkAuth();

        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("auth-change", checkAuth);
        };
    }, [router]);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        async function loadDashboard() {
            try {
                setLoading(true);

                const [
                    workspaceData,
                    projectData,
                    taskData,
                ] = await Promise.all([
                    getWorkspaces(),
                    getProjects(),
                    getTasks(),
                ]);

                setWorkspaces(workspaceData);

                const mappedProjects: Project[] = projectData.map(
                    (project) => ({
                        id: project.id,
                        name: project.name,
                        workspace: project.workspace.name,
                        completedTasks:
                            project.completed_tasks_count,
                        totalTasks: project.tasks_count,
                        status: mapProjectStatus(project.status),
                    })
                );

                const mappedTasks: Task[] = taskData
                    .map((task) => ({
                        id: task.id,
                        title: task.title,
                        project: task.project.name,
                        workspace: task.project.workspace.name,
                        status: mapTaskStatus(task.status),
                        dueDate: formatDueDate(task.due_date),
                    }))
                    .sort((a, b) => a.id - b.id);

                setProjects(mappedProjects);
                setRecentTasks(mappedTasks.slice(0, 5));
            } catch {
                setWorkspaces([]);
                setProjects([]);
                setRecentTasks([]);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [isAuthenticated]);

    const workspaceCount = workspaces.length;
    const projectCount = projects.length;
    const taskCount = recentTasks.length;

    const allTasksCount = useMemo(() => {
        return recentTasks.length;
    }, [recentTasks]);

    const pendingTasks = useMemo(() => {
        return recentTasks.filter(
            (task) =>
                task.status !== "DONE"
        ).length;
    }, [recentTasks]);

    const completedTasks = useMemo(() => {
        return recentTasks.filter(
            (task) => task.status === "DONE"
        ).length;
    }, [recentTasks]);

    const overallCompletion = useMemo(() => {
        if (allTasksCount === 0) {
            return 0;
        }

        return Math.round(
            (completedTasks / allTasksCount) * 100
        );
    }, [allTasksCount, completedTasks]);

    const activeProjects = useMemo(() => {
        return projects.filter(
            (project) =>
                project.status === "Active" ||
                project.status === "In Review"
        );
    }, [projects]);

    if (
        isAuthenticated === null ||
        !isAuthenticated ||
        loading
    ) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#020617] text-[#F8FAFC] selection:bg-indigo-500 selection:text-white">
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] px-5 py-6 shadow-2xl shadow-black/10 sm:px-7 sm:py-7 lg:px-8">
                    <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-indigo-500/[0.06] blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div className="max-w-2xl">
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                    Dashboard
                                </span>

                                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">
                                    NexaFlow
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                                Workspace Dashboard
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                                A quick overview of your workspaces, projects,
                                and tasks.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Link
                                href="/workspaces"
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-medium text-slate-300 transition-all hover:border-indigo-500/30 hover:bg-slate-900 hover:text-white active:scale-[0.98]"
                            >
                                New Workspace
                            </Link>

                            <Link
                                href="/projects"
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all hover:bg-indigo-400 active:scale-[0.98]"
                            >
                                Create Project
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Link
                        href="/workspaces"
                        className="group rounded-2xl border border-slate-800 bg-[#111827] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-[#151d2d]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Workspace
                                </span>

                                <h3 className="mt-1.5 text-base font-semibold text-slate-50">
                                    Workspaces
                                </h3>

                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                    Manage your teams and workspaces
                                </p>
                            </div>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm text-indigo-400 transition-all group-hover:border-indigo-500/30 group-hover:bg-indigo-500/15">
                                →
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-4">
                            <span className="text-xs text-slate-400">
                                {workspaceCount} Total
                            </span>

                            <span className="text-xs font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                                Open →
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/projects"
                        className="group rounded-2xl border border-slate-800 bg-[#111827] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-[#151d2d]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Projects
                                </span>

                                <h3 className="mt-1.5 text-base font-semibold text-slate-50">
                                    Projects
                                </h3>

                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                    Track and manage your projects
                                </p>
                            </div>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sm text-sky-400 transition-all group-hover:border-sky-500/30 group-hover:bg-sky-500/15">
                                →
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-4">
                            <span className="text-xs text-slate-400">
                                {projectCount} Total
                            </span>

                            <span className="text-xs font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                                Open →
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/tasks"
                        className="group rounded-2xl border border-slate-800 bg-[#111827] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-[#151d2d]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Tasks
                                </span>

                                <h3 className="mt-1.5 text-base font-semibold text-slate-50">
                                    Tasks
                                </h3>

                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                    View and manage your tasks
                                </p>
                            </div>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-400 transition-all group-hover:border-emerald-500/30 group-hover:bg-emerald-500/15">
                                →
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-4">
                            <span className="text-xs text-slate-400">
                                {pendingTasks} Pending
                            </span>

                            <span className="text-xs font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                                Open →
                            </span>
                        </div>
                    </Link>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Workspaces
                            </span>

                            <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                            <span className="text-3xl font-semibold tracking-tight text-slate-50">
                                {workspaceCount}
                            </span>

                            <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400">
                                Total
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Projects
                            </span>

                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                            <span className="text-3xl font-semibold tracking-tight text-slate-50">
                                {projectCount}
                            </span>

                            <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                                Active {activeProjects.length}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Pending Tasks
                            </span>

                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                            <span className="text-3xl font-semibold tracking-tight text-slate-50">
                                {pendingTasks}
                            </span>

                            <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400">
                                Open
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Completion
                            </span>

                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                            <span className="text-3xl font-semibold tracking-tight text-slate-50">
                                {overallCompletion}%
                            </span>

                            <span className="text-xs font-medium text-emerald-400">
                                {completedTasks} Done
                            </span>
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="min-w-0 space-y-5 lg:col-span-2">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-indigo-400" />

                                    <h2 className="text-lg font-semibold tracking-tight text-slate-50">
                                        Active Projects
                                    </h2>
                                </div>

                                <p className="mt-1.5 text-xs text-slate-500">
                                    Projects that currently need attention
                                </p>
                            </div>

                            <Link
                                href="/projects"
                                className="shrink-0 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {activeProjects.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/60 p-8 text-center">
                                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-500">
                                        —
                                    </div>

                                    <p className="mt-4 text-sm font-medium text-slate-300">
                                        No active projects
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Your active projects will appear here.
                                    </p>

                                    <Link
                                        href="/projects"
                                        className="mt-4 inline-flex text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                                    >
                                        View Projects →
                                    </Link>
                                </div>
                            ) : (
                                activeProjects.map((project) => {
                                    const percent =
                                        project.totalTasks > 0
                                            ? Math.round(
                                                (project.completedTasks /
                                                    project.totalTasks) *
                                                100
                                            )
                                            : 0;

                                    return (
                                        <Link
                                            href={`/projects/${project.id}`}
                                            key={project.id}
                                            className="group block rounded-2xl border border-slate-800 bg-[#111827] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-[#151d2d]"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="max-w-full truncate text-xs font-medium text-indigo-400">
                                                            {project.workspace}
                                                        </span>

                                                        <span className="text-slate-700">
                                                            •
                                                        </span>

                                                        <span className="text-xs text-slate-500">
                                                            {project.status}
                                                        </span>
                                                    </div>

                                                    <h3 className="mt-1.5 truncate text-base font-semibold text-slate-100">
                                                        {project.name}
                                                    </h3>
                                                </div>

                                                <span className="w-fit shrink-0 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400">
                                                    {project.completedTasks}/
                                                    {project.totalTasks} Tasks
                                                </span>
                                            </div>

                                            <div className="mt-5 space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-500">
                                                        Progress
                                                    </span>

                                                    <span className="font-medium text-slate-300">
                                                        {percent}%
                                                    </span>
                                                </div>

                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                                    <div
                                                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                                                        style={{
                                                            width: `${percent}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="min-w-0 space-y-5">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-sky-400" />

                                    <h2 className="text-lg font-semibold tracking-tight text-slate-50">
                                        Recent Tasks
                                    </h2>
                                </div>

                                <p className="mt-1.5 text-xs text-slate-500">
                                    Your latest task activity
                                </p>
                            </div>

                            <Link
                                href="/tasks"
                                className="shrink-0 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                            {recentTasks.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-500">
                                        —
                                    </div>

                                    <p className="mt-4 text-sm font-medium text-slate-300">
                                        No tasks yet
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Your recent tasks will appear here.
                                    </p>

                                    <Link
                                        href="/tasks"
                                        className="mt-4 inline-flex text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                                    >
                                        View Tasks →
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800/70">
                                    {recentTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-4 transition-colors hover:bg-slate-900/50 sm:p-5"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <span className="max-w-[45%] truncate text-[11px] font-medium text-indigo-400">
                                                        {task.workspace}
                                                    </span>

                                                    <span className="text-slate-700">
                                                        •
                                                    </span>

                                                    <span className="min-w-0 truncate text-[11px] text-slate-500">
                                                        {task.project}
                                                    </span>
                                                </div>

                                                <p className="mt-2 truncate text-sm font-semibold text-slate-200">
                                                    {task.title}
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                    <span className="text-[11px] text-slate-500">
                                                        Due: {task.dueDate}
                                                    </span>

                                                    {task.status === "DONE" && (
                                                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                                                            DONE
                                                        </span>
                                                    )}

                                                    {task.status === "IN_PROGRESS" && (
                                                        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold text-indigo-400">
                                                            IN PROGRESS
                                                        </span>
                                                    )}

                                                    {task.status === "IN_REVIEW" && (
                                                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
                                                            IN REVIEW
                                                        </span>
                                                    )}

                                                    {task.status === "TODO" && (
                                                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                                                            TODO
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}