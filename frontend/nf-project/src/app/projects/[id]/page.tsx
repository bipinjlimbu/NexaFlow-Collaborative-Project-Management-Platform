"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    FolderKanban,
    Plus,
    Users,
    X,
    Pencil,
    Trash2,
} from "lucide-react";
import {
    getProject,
    getProjectMembers,
    getWorkspaceMembers,
    addMemberToProject,
    deleteProject,
    getTasksInProject,
} from "@/services/projectService";
import type {
    Project,
    ProjectMember,
} from "@/types/project";
import type { Task } from "@/types/task";
import type { WorkspaceDetailMember } from "@/types/workspace";
import ProjectDetailSkeleton from "@/components/ProjectDetailSkeleton";
import EditProjectForm from "@/components/EditProjectForm";
import AddTaskForm from "@/components/AddTaskForm";

function formatDate(date: string | null) {
    if (!date) return "Not set";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not set";
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function formatDateTime(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function getStatusLabel(status: Project["status"]) {
    switch (status) {
        case "active":
            return "Active";
        case "inactive":
            return "Inactive";
        case "archived":
            return "Archived";
        default:
            return "Planning";
    }
}

function getPriorityLabel(priority: Project["priority"]) {
    switch (priority) {
        case "low":
            return "Low";
        case "high":
            return "High";
        case "urgent":
            return "Urgent";
        default:
            return "Medium";
    }
}

function getPriorityClass(priority: Project["priority"]) {
    switch (priority) {
        case "low":
            return "border-slate-700 bg-slate-800/60 text-slate-300";
        case "high":
            return "border-amber-500/30 bg-amber-500/10 text-amber-400";
        case "urgent":
            return "border-rose-500/30 bg-rose-500/10 text-rose-400";
        default:
            return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    }
}

function getStatusClass(status: Project["status"]) {
    switch (status) {
        case "active":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
        case "inactive":
            return "border-amber-500/30 bg-amber-500/10 text-amber-400";
        case "archived":
            return "border-slate-700 bg-slate-800/60 text-slate-400";
        default:
            return "border-indigo-500/30 bg-indigo-500/10 text-indigo-400";
    }
}

function getTaskStatusLabel(status: Task["status"]) {
    switch (status) {
        case "todo":
            return "To Do";
        case "in_progress":
            return "In Progress";
        case "review":
            return "Review";
        case "done":
            return "Done";
        default:
            return "Backlog";
    }
}

function getTaskStatusClass(status: Task["status"]) {
    switch (status) {
        case "todo":
            return "border-indigo-500/30 bg-indigo-500/10 text-indigo-400";
        case "in_progress":
            return "border-amber-500/30 bg-amber-500/10 text-amber-400";
        case "review":
            return "border-indigo-500/30 bg-indigo-500/10 text-indigo-300";
        case "done":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
        default:
            return "border-slate-700 bg-slate-800/60 text-slate-400";
    }
}

function getTaskPriorityLabel(priority: Task["priority"]) {
    switch (priority) {
        case "low":
            return "Low";
        case "high":
            return "High";
        case "urgent":
            return "Urgent";
        default:
            return "Medium";
    }
}

function getTaskPriorityClass(priority: Task["priority"]) {
    switch (priority) {
        case "low":
            return "border-slate-700 bg-slate-800/60 text-slate-300";
        case "high":
            return "border-amber-500/30 bg-amber-500/10 text-amber-400";
        case "urgent":
            return "border-rose-500/30 bg-rose-500/10 text-rose-400";
        default:
            return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    }
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [membersLoading, setMembersLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [error, setError] = useState("");
    const [membersError, setMembersError] = useState("");
    const [tasksError, setTasksError] = useState("");

    const [showMembers, setShowMembers] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [workspaceMembers, setWorkspaceMembers] =
        useState<WorkspaceDetailMember[]>([]);
    const [workspaceMembersLoading, setWorkspaceMembersLoading] =
        useState(false);
    const [workspaceMembersError, setWorkspaceMembersError] =
        useState("");
    const [addingMemberId, setAddingMemberId] =
        useState<number | null>(null);
    const [addMemberError, setAddMemberError] = useState("");
    const [addMemberSuccess, setAddMemberSuccess] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
    const MEDIA_URL = API_URL.replace(/\/api\/?$/, "");

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            router.replace("/login");
            return;
        }

        const projectId = Number(params.id);

        if (!projectId) {
            setError("Invalid project.");
            setLoading(false);
            setMembersLoading(false);
            setTasksLoading(false);
            return;
        }

        async function loadProject() {
            try {
                setLoading(true);
                setMembersLoading(true);
                setTasksLoading(true);
                setError("");
                setMembersError("");
                setTasksError("");

                const [projectData, membersData, tasksData] =
                    await Promise.all([
                        getProject(projectId),
                        getProjectMembers(projectId),
                        getTasksInProject(projectId),
                    ]);

                setProject(projectData);
                setProjectMembers(membersData);
                setTasks(tasksData);
            } catch (err: any) {
                if (err && typeof err === "object") {
                    if (typeof err.error === "string") {
                        setError(err.error);
                    } else if (typeof err.detail === "string") {
                        setError(err.detail);
                    } else {
                        setError("Unable to load project.");
                    }
                } else {
                    setError("Unable to load project.");
                }
            } finally {
                setLoading(false);
                setMembersLoading(false);
                setTasksLoading(false);
            }
        }

        loadProject();
    }, [params.id, router]);

    async function handleDelete() {
        if (!project || deleting) return;

        try {
            setDeleting(true);
            setDeleteError("");

            await deleteProject(project.id);

            router.push("/projects");
        } catch (err: any) {
            if (err && typeof err === "object") {
                if (typeof err.error === "string") {
                    setDeleteError(err.error);
                } else if (typeof err.detail === "string") {
                    setDeleteError(err.detail);
                } else {
                    setDeleteError("Unable to delete project.");
                }
            } else {
                setDeleteError("Unable to delete project.");
            }

            setDeleting(false);
        }
    }

    async function handleAddMember() {
        if (!project) return;

        try {
            setShowMembers(true);
            setWorkspaceMembersLoading(true);
            setWorkspaceMembersError("");
            setAddMemberError("");
            setAddMemberSuccess("");

            const members = await getWorkspaceMembers(
                project.workspace.id
            );

            setWorkspaceMembers(members);
        } catch (err: any) {
            if (err && typeof err === "object") {
                if (typeof err.error === "string") {
                    setWorkspaceMembersError(err.error);
                } else if (typeof err.detail === "string") {
                    setWorkspaceMembersError(err.detail);
                } else {
                    setWorkspaceMembersError(
                        "Unable to load workspace members."
                    );
                }
            } else {
                setWorkspaceMembersError(
                    "Unable to load workspace members."
                );
            }
        } finally {
            setWorkspaceMembersLoading(false);
        }
    }

    async function handleAddWorkspaceMember(userId: number) {
        if (!project) return;

        try {
            setAddingMemberId(userId);
            setAddMemberError("");
            setAddMemberSuccess("");

            const response = await addMemberToProject(
                project.id,
                userId
            );

            setAddMemberSuccess(
                response.message ||
                "User added to project successfully."
            );

            const updatedMembers = await getProjectMembers(
                project.id
            );

            setProjectMembers(updatedMembers);
        } catch (err: any) {
            if (err && typeof err === "object") {
                if (typeof err.error === "string") {
                    setAddMemberError(err.error);
                } else if (typeof err.detail === "string") {
                    setAddMemberError(err.detail);
                } else {
                    setAddMemberError(
                        "Unable to add member to project."
                    );
                }
            } else {
                setAddMemberError(
                    "Unable to add member to project."
                );
            }
        } finally {
            setAddingMemberId(null);
        }
    }

    async function handleTaskCreated() {
        if (!project) return;

        try {
            const updatedTasks = await getTasksInProject(project.id);

            setTasks(updatedTasks);
            setShowAddTaskForm(false);
        } catch {
            setShowAddTaskForm(false);
        }
    }

    if (loading) {
        return <ProjectDetailSkeleton />;
    }

    if (error || !project) {
        return (
            <main className="min-h-screen bg-[#020617] text-slate-50">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
                    <button
                        type="button"
                        onClick={() => router.push("/projects")}
                        className="group mb-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-[#111827] px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100"
                    >
                        <ArrowLeft
                            size={16}
                            className="transition-transform group-hover:-translate-x-1"
                        />
                        Back to Projects
                    </button>

                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10">
                            <FolderKanban
                                size={19}
                                className="text-rose-400"
                            />
                        </div>

                        <h1 className="mt-5 text-lg font-semibold text-rose-400">
                            Project not found
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            {error || "Unable to load this project."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <button
                    type="button"
                    onClick={() => router.push("/projects")}
                    className="group mb-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-[#111827] px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100"
                >
                    <ArrowLeft
                        size={16}
                        className="transition-transform group-hover:-translate-x-1"
                    />
                    Back to Projects
                </button>

                <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8">
                    <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl" />

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 max-w-3xl">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                                    <FolderKanban size={22} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
                                        Project #{project.id}
                                    </p>

                                    <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                                        {project.name}
                                    </h1>
                                </div>
                            </div>

                            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                {project.description ||
                                    "No project description provided."}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClass(
                                        project.status
                                    )}`}
                                >
                                    {getStatusLabel(project.status)}
                                </span>

                                <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${getPriorityClass(
                                        project.priority
                                    )}`}
                                >
                                    {getPriorityLabel(project.priority)}{" "}
                                    Priority
                                </span>
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row lg:shrink-0">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowEditForm(true)
                                }
                                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 text-sm font-medium text-indigo-300 transition hover:border-indigo-500/50 hover:bg-indigo-500 hover:text-white"
                            >
                                <Pencil size={15} />
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 text-sm font-medium text-rose-400 transition hover:border-rose-500/50 hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 size={15} />
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>

                    {deleteError && (
                        <div className="relative mt-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                            {deleteError}
                        </div>
                    )}
                </section>

                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            label: "Project ID",
                            value: `#${project.id}`,
                            icon: FolderKanban,
                        },
                        {
                            label: "Start date",
                            value: formatDate(project.start_date),
                            icon: Calendar,
                        },
                        {
                            label: "Due date",
                            value: formatDate(project.due_date),
                            icon: Clock,
                        },
                        {
                            label: "Tasks",
                            value: tasks.length,
                            icon: CheckCircle2,
                        },
                    ].map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                                        <Icon size={18} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-500">
                                            {stat.label}
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-slate-100">
                                    Tasks
                                </h2>

                                <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-400">
                                    {tasks.length}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage tasks for this project.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowAddTaskForm(true)}
                            className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:w-auto"
                        >
                            <Plus size={17} />
                            Add Task
                        </button>
                    </div>

                    <div className="mt-5">
                        {tasksLoading ? (
                            <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] py-12">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
                            </div>
                        ) : tasksError ? (
                            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-center">
                                <p className="text-sm text-rose-400">
                                    {tasksError}
                                </p>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-800 bg-[#0F172A]/60 p-10 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#111827] text-slate-500">
                                    <CheckCircle2 size={21} />
                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-300">
                                    No tasks yet
                                </p>

                                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                                    Add your first task to start working on this
                                    project.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tasks.map((task) => {
                                    const assignedUser =
                                        task.assigned_to;

                                    const assignedName =
                                        assignedUser
                                            ? `${assignedUser.first_name || ""} ${assignedUser.last_name || ""}`.trim() ||
                                            assignedUser.username
                                            : "Unassigned";

                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() =>
                                                router.push(
                                                    `/tasks/${task.id}`
                                                )
                                            }
                                            className="group cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] p-4 transition hover:border-slate-700 hover:bg-slate-800/50 sm:p-5"
                                        >
                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="min-w-0 text-sm font-semibold text-slate-200 group-hover:text-white">
                                                            {task.title}
                                                        </h3>

                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${getTaskStatusClass(
                                                                task.status
                                                            )}`}
                                                        >
                                                            {getTaskStatusLabel(
                                                                task.status
                                                            )}
                                                        </span>

                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${getTaskPriorityClass(
                                                                task.priority
                                                            )}`}
                                                        >
                                                            {getTaskPriorityLabel(
                                                                task.priority
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                                        {task.description ||
                                                            "No task description provided."}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 lg:min-w-28 lg:text-right">
                                                    <p className="text-xs text-slate-600">
                                                        Due date
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-slate-300">
                                                        {formatDate(
                                                            task.due_date
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-800 pt-4 sm:grid-cols-3">
                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-slate-600">
                                                        Assigned to
                                                    </p>

                                                    <p className="mt-1 truncate text-xs font-medium text-slate-400">
                                                        {assignedName}
                                                    </p>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-slate-600">
                                                        Created by
                                                    </p>

                                                    <p className="mt-1 truncate text-xs font-medium text-slate-400">
                                                        {task.created_by
                                                            .first_name ||
                                                            task.created_by
                                                                .last_name
                                                            ? `${task.created_by.first_name || ""} ${task.created_by.last_name || ""}`.trim()
                                                            : task.created_by
                                                                .username}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[11px] text-slate-600">
                                                        Created
                                                    </p>

                                                    <p className="mt-1 text-xs font-medium text-slate-400">
                                                        {formatDateTime(
                                                            task.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Project Details
                        </h2>

                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-slate-500">
                                    Workspace
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-200">
                                    {project.workspace.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Workspace ID
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-200">
                                    #{project.workspace.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Members
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-200">
                                    {projectMembers.length}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Created
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-200">
                                    {formatDateTime(
                                        project.created_at
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Last updated
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-200">
                                    {formatDateTime(
                                        project.updated_at
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Workspace projects
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-200">
                                    {project.workspace.projects_count}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Created By
                        </h2>

                        <div className="mt-5 flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                {project.created_by.profile_picture ? (
                                    <img
                                        src={`${MEDIA_URL}${project.created_by.profile_picture}`}
                                        alt={
                                            project.created_by.username
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    project.created_by.username
                                        .slice(0, 2)
                                        .toUpperCase()
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-200">
                                    {project.created_by.first_name ||
                                        project.created_by.last_name
                                        ? `${project.created_by.first_name || ""} ${project.created_by.last_name || ""}`.trim()
                                        : project.created_by.username}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                    @{project.created_by.username}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-slate-600">
                                    {project.created_by.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-slate-100">
                                    Project Members
                                </h2>

                                <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-400">
                                    {projectMembers.length}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                {projectMembers.length} member
                                {projectMembers.length === 1
                                    ? ""
                                    : "s"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddMember}
                            className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:w-auto"
                        >
                            <Plus size={17} />
                            Add Member
                        </button>
                    </div>

                    <div className="mt-5">
                        {membersLoading ? (
                            <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] py-12">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
                            </div>
                        ) : membersError ? (
                            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-center">
                                <p className="text-sm text-rose-400">
                                    {membersError}
                                </p>
                            </div>
                        ) : projectMembers.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-800 bg-[#0F172A]/60 p-8 text-center">
                                <p className="text-sm font-medium text-slate-400">
                                    No project members yet
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                    Add members from your workspace to this
                                    project.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {projectMembers.map((member) => {
                                    const user = member.user;

                                    const fullName =
                                        `${user.first_name || ""} ${user.last_name || ""}`.trim();

                                    return (
                                        <div
                                            key={member.id}
                                            className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-800 bg-[#0F172A] p-4 transition hover:border-slate-700"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                                                {user.profile_picture ? (
                                                    <img
                                                        src={`${MEDIA_URL}${user.profile_picture}`}
                                                        alt={
                                                            fullName ||
                                                            user.username
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    (
                                                        fullName ||
                                                        user.username ||
                                                        "U"
                                                    )
                                                        .slice(0, 2)
                                                        .toUpperCase()
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-200">
                                                    {fullName ||
                                                        user.username}
                                                </p>

                                                <p className="truncate text-xs text-slate-500">
                                                    @{user.username}
                                                </p>

                                                <p className="truncate text-xs text-slate-600">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {showMembers && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm sm:px-6">
                    <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-2xl">
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 p-5 sm:p-6">
                            <div className="min-w-0">
                                <h2 className="text-lg font-semibold text-slate-100">
                                    Workspace Members
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Select a member to add to this project.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowMembers(false);
                                    setAddMemberError("");
                                    setAddMemberSuccess("");
                                }}
                                className="ml-4 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5 sm:p-6">
                            {addMemberSuccess && (
                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                                    <p className="text-sm text-emerald-400">
                                        {addMemberSuccess}
                                    </p>
                                </div>
                            )}

                            {addMemberError && (
                                <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                                    <p className="text-sm text-rose-400">
                                        {addMemberError}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4">
                                {workspaceMembersLoading ? (
                                    <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] py-12">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
                                    </div>
                                ) : workspaceMembersError ? (
                                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-center">
                                        <p className="text-sm text-rose-400">
                                            {workspaceMembersError}
                                        </p>
                                    </div>
                                ) : workspaceMembers.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center">
                                        <p className="text-sm text-slate-500">
                                            No workspace members found.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {workspaceMembers.map((member) => {
                                            const user = member.user;

                                            const fullName =
                                                `${user.first_name || ""} ${user.last_name || ""}`.trim();

                                            return (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0F172A] p-4"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                                                            {user.profile_picture ? (
                                                                <img
                                                                    src={`${MEDIA_URL}${user.profile_picture}`}
                                                                    alt={
                                                                        fullName ||
                                                                        user.username
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                (
                                                                    fullName ||
                                                                    user.username ||
                                                                    "U"
                                                                )
                                                                    .slice(
                                                                        0,
                                                                        2
                                                                    )
                                                                    .toUpperCase()
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-slate-200">
                                                                {fullName ||
                                                                    user.username}
                                                            </p>

                                                            <p className="truncate text-xs text-slate-500">
                                                                @{user.username}
                                                            </p>

                                                            <p className="truncate text-xs text-slate-600">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAddWorkspaceMember(
                                                                user.id
                                                            )
                                                        }
                                                        disabled={
                                                            addingMemberId ===
                                                            user.id
                                                        }
                                                        className="ml-2 shrink-0 cursor-pointer rounded-lg bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {addingMemberId ===
                                                            user.id
                                                            ? "Adding..."
                                                            : "Add"}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditForm && (
                <EditProjectForm
                    project={project}
                    onClose={() => setShowEditForm(false)}
                    onUpdated={(updatedProject) =>
                        setProject(updatedProject)
                    }
                />
            )}

            {showAddTaskForm && (
                <AddTaskForm
                    projectId={project.id}
                    projectMembers={projectMembers}
                    onClose={() => setShowAddTaskForm(false)}
                    onCreated={handleTaskCreated}
                />
            )}
        </main>
    );
}