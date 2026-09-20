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
} from "lucide-react";
import {
    getProject,
    getWorkspaceMembers,
    addMemberToProject,
    Project,
    WorkspaceMember,
} from "@/services/projectService";
import ProjectDetailSkeleton from "@/components/ProjectDetailSkeleton";

function formatDate(date: string | null) {
    if (!date) {
        return "Not set";
    }

    const parsedDate = new Date(`${date} T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not set";
    }

    return parsedDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }
    );
}

function formatDateTime(date: string) {
    return new Date(date).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }
    );
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
            return "border-slate-500/20 bg-slate-500/10 text-slate-400";
        case "high":
            return "border-orange-500/20 bg-orange-500/10 text-orange-400";
        case "urgent":
            return "border-red-500/20 bg-red-500/10 text-red-400";
        default:
            return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }
}

function getStatusClass(status: Project["status"]) {
    switch (status) {
        case "active":
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
        case "inactive":
            return "border-amber-500/20 bg-amber-500/10 text-amber-400";
        case "archived":
            return "border-slate-500/20 bg-slate-500/10 text-slate-400";
        default:
            return "border-indigo-500/20 bg-indigo-500/10 text-indigo-400";
    }
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showMembers, setShowMembers] = useState(false);
    const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersError, setMembersError] = useState("");
    const [addingMemberId, setAddingMemberId] = useState<number | null>(null);
    const [addMemberError, setAddMemberError] = useState("");
    const [addMemberSuccess, setAddMemberSuccess] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
    const MEDIA_URL = API_URL.replace(/\/api\/?$/, "");

    console.log(
        `Full image URL: ${MEDIA_URL}${project?.created_by.profile_picture} `
    );

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
            return;
        }

        async function loadProject() {
            try {
                setLoading(true);
                setError("");

                const data = await getProject(projectId);

                setProject(data);
            } catch (err: any) {
                if (err && typeof err === "object") {
                    if (typeof err.error === "string") {
                        setError(err.error);
                    } else if (typeof err.detail === "string") {
                        setError(err.detail);
                    } else {
                        setError("Project not found.");
                    }
                } else {
                    setError("Unable to load project.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadProject();
    }, [params.id, router]);

    async function handleAddMember() {
        if (!project) {
            return;
        }

        try {
            setShowMembers(true);
            setMembersLoading(true);
            setMembersError("");
            setAddMemberError("");
            setAddMemberSuccess("");

            const members = await getWorkspaceMembers(
                project.workspace.id
            );

            setWorkspaceMembers(members);
        } catch (err: any) {
            if (err && typeof err === "object") {
                if (typeof err.error === "string") {
                    setMembersError(err.error);
                } else if (typeof err.detail === "string") {
                    setMembersError(err.detail);
                } else {
                    setMembersError("Unable to load workspace members.");
                }
            } else {
                setMembersError("Unable to load workspace members.");
            }
        } finally {
            setMembersLoading(false);
        }
    }

    async function handleAddWorkspaceMember(userId: number) {
        if (!project) {
            return;
        }

        try {
            setAddingMemberId(userId);
            setAddMemberError("");
            setAddMemberSuccess("");

            const response = await addMemberToProject(
                project.id,
                userId
            );

            setAddMemberSuccess(
                response.message || "User added to project successfully."
            );
        } catch (err: any) {
            if (err && typeof err === "object") {
                if (typeof err.error === "string") {
                    setAddMemberError(err.error);
                } else if (typeof err.detail === "string") {
                    setAddMemberError(err.detail);
                } else {
                    setAddMemberError("Unable to add member to project.");
                }
            } else {
                setAddMemberError("Unable to add member to project.");
            }
        } finally {
            setAddingMemberId(null);
        }
    }

    if (loading) {
        return <ProjectDetailSkeleton />;
    }

    if (error || !project) {
        return (
            <main className="min-h-screen bg-slate-950 text-slate-50">
                <div className="mx-auto max-w-5xl px-6 py-10">
                    <button
                        type="button"
                        onClick={() => router.push("/projects")}
                        className="mb-8 flex cursor-pointer items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                    >
                        <ArrowLeft size={17} />
                        Back to projects
                    </button>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
                        <h1 className="text-lg font-semibold text-red-400">
                            Project not found
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            {error || "Unable to load this project."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    console.log("Project data:", project);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <button
                    type="button"
                    onClick={() => router.push("/projects")}
                    className="mb-8 flex cursor-pointer items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                    <ArrowLeft size={17} />
                    Back to projects
                </button>

                <div className="mb-8 border-b border-slate-800/80 pb-8">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/20 text-indigo-400">
                                <FolderKanban size={21} />
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {project.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                                {project.description ||
                                    "No project description provided."}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <span
                                    className={`rounded - full border px - 3 py - 1 text - xs font - medium ${getStatusClass(
                                        project.status
                                    )
                                        } `}
                                >
                                    {getStatusLabel(project.status)}
                                </span>

                                <span
                                    className={`rounded - full border px - 3 py - 1 text - xs font - medium ${getPriorityClass(
                                        project.priority
                                    )
                                        } `}
                                >
                                    {getPriorityLabel(project.priority)} Priority
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                <FolderKanban size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Project ID
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-200">
                                    #{project.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                <Calendar size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Start date
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-200">
                                    {project.start_date
                                        ? formatDate(project.start_date)
                                        : "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                <Clock size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Due date
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-200">
                                    {formatDate(project.due_date)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                <CheckCircle2 size={18} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Tasks
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-200">
                                    {project.tasks_count}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">
                                Tasks
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage tasks for this project
                            </p>
                        </div>

                        <button
                            type="button"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                        >
                            <Plus size={17} />
                            Add task
                        </button>
                    </div>

                    <div className="mt-5 rounded-xl border border-dashed border-slate-800 p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/50 text-slate-500">
                            <CheckCircle2 size={21} />
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-300">
                            No tasks yet
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Add your first task to start working on this project.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Project details
                        </h2>

                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-slate-500">
                                    Workspace
                                </p>

                                <p className="mt-1 text-sm text-slate-200">
                                    {project.workspace.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Workspace ID
                                </p>

                                <p className="mt-1 text-sm text-slate-200">
                                    #{project.workspace.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Members
                                </p>

                                <p className="mt-1 text-sm text-slate-200">
                                    {project.members_count}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Created
                                </p>

                                <p className="mt-1 text-sm text-slate-200">
                                    {formatDateTime(project.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Last updated
                                </p>

                                <p className="mt-1 text-sm text-slate-200">
                                    {formatDateTime(project.updated_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Workspace projects
                                </p>

                                <p className="mt-1 text-sm text-slate-200">
                                    {project.workspace.projects_count}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Created by
                        </h2>

                        <div className="mt-5 flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                {project?.created_by.profile_picture ? (
                                    <img
                                        src={`${MEDIA_URL}${project?.created_by.profile_picture} `}
                                        alt={project.created_by.username}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    project.created_by.username
                                        .slice(0, 2)
                                        .toUpperCase()
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-200">
                                    {project.created_by.first_name ||
                                        project.created_by.last_name
                                        ? `${project.created_by.first_name} ${project.created_by.last_name} `.trim()
                                        : project.created_by.username}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    @{project.created_by.username}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {project.created_by.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">
                                Project members
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {project.members_count} member
                                {project.members_count === 1 ? "" : "s"}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAddMember}
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                            >
                                <Plus size={17} />
                                Add member
                            </button>

                            <Users
                                size={20}
                                className="text-slate-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {showMembers && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-100">
                                    Workspace members
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Select a member to add to this project
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowMembers(false);
                                    setAddMemberError("");
                                    setAddMemberSuccess("");
                                }}
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {addMemberSuccess && (
                            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                                <p className="text-sm text-emerald-400">
                                    {addMemberSuccess}
                                </p>
                            </div>
                        )}

                        {addMemberError && (
                            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
                                <p className="text-sm text-red-400">
                                    {addMemberError}
                                </p>
                            </div>
                        )}

                        <div className="mt-5 max-h-96 overflow-y-auto">
                            {membersLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
                                </div>
                            ) : membersError ? (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
                                    <p className="text-sm text-red-400">
                                        {membersError}
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
                                    {workspaceMembers.map((member) => (
                                        <div
                                            key={member.user.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                                                    {(member.user.username || "U")
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-slate-200">
                                                        {member.user.username ||
                                                            "Unknown user"}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        @{member.user.username ||
                                                            "user"}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddWorkspaceMember(
                                                        member.user.id
                                                    )
                                                }
                                                disabled={
                                                    addingMemberId ===
                                                    member.user.id
                                                }
                                                className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {addingMemberId ===
                                                    member.user.id
                                                    ? "Adding..."
                                                    : "Add"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}