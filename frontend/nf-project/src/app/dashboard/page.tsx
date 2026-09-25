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
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-10 px-6 py-12">
                <section className="flex flex-col justify-between gap-6 border-b border-slate-800 pb-6 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                Dashboard
                            </span>

                            <span className="font-mono text-xs text-slate-500">
                                NEXAFLOW
                            </span>
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
                            Workspace Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Overview of your workspaces, projects, and tasks.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/workspaces"
                            className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-700 hover:text-white"
                        >
                            + New Workspace
                        </Link>

                        <Link
                            href="/projects"
                            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95"
                        >
                            + Create Project
                        </Link>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Link
                        href="/workspaces"
                        className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition-all hover:border-indigo-500/40 hover:bg-slate-900/70"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
                                    Workspace
                                </span>

                                <h3 className="mt-1 text-lg font-bold text-slate-100">
                                    Workspaces
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Manage your teams and workspaces
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition-all group-hover:bg-indigo-500/20">
                                →
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="font-mono text-xs text-slate-400">
                                {workspaceCount} Total
                            </span>

                            <span className="font-mono text-xs text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                                Open →
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/projects"
                        className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition-all hover:border-indigo-500/40 hover:bg-slate-900/70"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
                                    Projects
                                </span>

                                <h3 className="mt-1 text-lg font-bold text-slate-100">
                                    Projects
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Track and manage your projects
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400 transition-all group-hover:bg-sky-500/20">
                                →
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="font-mono text-xs text-slate-400">
                                {projectCount} Total
                            </span>

                            <span className="font-mono text-xs text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                                Open →
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/tasks"
                        className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition-all hover:border-indigo-500/40 hover:bg-slate-900/70"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
                                    Tasks
                                </span>

                                <h3 className="mt-1 text-lg font-bold text-slate-100">
                                    Tasks
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    View and manage your tasks
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-all group-hover:bg-emerald-500/20">
                                →
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="font-mono text-xs text-slate-400">
                                {pendingTasks} Pending
                            </span>

                            <span className="font-mono text-xs text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                                Open →
                            </span>
                        </div>
                    </Link>
                </section>

                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
                            Workspaces
                        </span>

                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-white">
                                {workspaceCount}
                            </span>

                            <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-mono text-xs text-indigo-400">
                                Total
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
                            Projects
                        </span>

                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-white">
                                {projectCount}
                            </span>

                            <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-400">
                                Active {activeProjects.length}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
                            Pending Tasks
                        </span>

                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-white">
                                {pendingTasks}
                            </span>

                            <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-400">
                                Open
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
                            Completion
                        </span>

                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-white">
                                {overallCompletion}%
                            </span>

                            <span className="font-mono text-xs text-emerald-400">
                                {completedTasks} Done
                            </span>
                        </div>
                    </div>
                </section>

                <section className="grid gap-8 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                                Active Projects
                            </h2>

                            <Link
                                href="/projects"
                                className="font-mono text-xs text-indigo-400 hover:underline"
                            >
                                View All Projects →
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {activeProjects.length === 0 ? (
                                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center">
                                    <p className="text-sm text-slate-400">
                                        No active projects.
                                    </p>

                                    <Link
                                        href="/projects"
                                        className="mt-3 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300"
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
                                            className="block space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition-colors hover:border-slate-700 hover:bg-slate-900/60"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-indigo-400">
                                                            {project.workspace}
                                                        </span>

                                                        <span className="text-slate-600">
                                                            •
                                                        </span>

                                                        <span className="text-xs text-slate-400">
                                                            {project.status}
                                                        </span>
                                                    </div>

                                                    <h3 className="mt-1 text-base font-bold text-slate-100">
                                                        {project.name}
                                                    </h3>
                                                </div>

                                                <span className="shrink-0 rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-400">
                                                    {project.completedTasks}/
                                                    {project.totalTasks} Tasks
                                                </span>
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="flex justify-between font-mono text-xs text-slate-400">
                                                    <span>Progress</span>
                                                    <span>{percent}%</span>
                                                </div>

                                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
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

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                                <span className="h-2 w-2 rounded-full bg-sky-400" />
                                Recent Tasks
                            </h2>

                            <Link
                                href="/tasks"
                                className="font-mono text-xs text-indigo-400 hover:underline"
                            >
                                View All →
                            </Link>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40">
                            {recentTasks.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-slate-400">
                                        No tasks available.
                                    </p>

                                    <Link
                                        href="/tasks"
                                        className="mt-3 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300"
                                    >
                                        View Tasks →
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800/60">
                                    {recentTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-4 transition-colors hover:bg-slate-900/70"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-[11px] text-indigo-400">
                                                        {task.workspace}
                                                    </span>

                                                    <span className="text-slate-700">
                                                        •
                                                    </span>

                                                    <span className="truncate text-[11px] text-slate-500">
                                                        {task.project}
                                                    </span>
                                                </div>

                                                <p className="text-sm font-semibold text-slate-200">
                                                    {task.title}
                                                </p>

                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="font-mono text-[11px] text-slate-500">
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