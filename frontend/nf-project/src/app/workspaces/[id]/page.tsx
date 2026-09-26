"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    deleteWorkspace,
    demoteWorkspaceMember,
    getUsers,
    getWorkspace,
    getWorkspaceProjects,
    promoteWorkspaceMember,
    removeWorkspaceMember,
    sendWorkspaceInvitation,
    updateWorkspace,
} from "@/services/workspaceService";
import { createProject } from "@/services/projectService";
import type {
    WorkspaceDetail,
    WorkspaceProject,
} from "@/types/workspace";
import type { ProjectStatus, ProjectPriority } from "@/types/project";
import type { User } from "@/types/user";
import WorkspaceDetailSkeleton from "@/components/WorkspaceDetailSkeleton";

export default function WorkspaceDetailPage() {
    const params = useParams();
    const router = useRouter();

    const workspaceId = Number(params.id);

    const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const [showEditPanel, setShowEditPanel] = useState(false);
    const [showInvitePanel, setShowInvitePanel] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showProjectPanel, setShowProjectPanel] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isArchived, setIsArchived] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");
    const [userSearch, setUserSearch] = useState("");

    const [invitingUserId, setInvitingUserId] = useState<number | null>(null);
    const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);
    const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
    const [inviteError, setInviteError] = useState("");

    const [promotingUserId, setPromotingUserId] = useState<number | null>(null);
    const [demotingUserId, setDemotingUserId] = useState<number | null>(null);
    const [removingUserId, setRemovingUserId] = useState<number | null>(null);
    const [memberActionError, setMemberActionError] = useState("");

    const [projects, setProjects] = useState<WorkspaceProject[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState("");

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectDueDate, setProjectDueDate] = useState("");
    const [projectStatus, setProjectStatus] = useState<ProjectStatus>("active");
    const [projectPriority, setProjectPriority] = useState<ProjectPriority>("medium");
    const [creatingProject, setCreatingProject] = useState(false);
    const [projectError, setProjectError] = useState("");

    useEffect(() => {
        const access = localStorage.getItem("access");

        if (!access) {
            router.replace("/login");
            return;
        }

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);

                if (user?.id) {
                    setCurrentUserId(Number(user.id));
                }
            } catch {
                setCurrentUserId(null);
            }
        }

        async function loadWorkspace() {
            try {
                setLoading(true);
                setError("");

                const data = await getWorkspace(workspaceId);

                setWorkspace(data);
                setName(data.name);
                setDescription(data.description || "");
                setIsArchived(data.is_archived);
            } catch (err: any) {
                setError(
                    err?.detail ||
                    err?.error ||
                    "Unable to load workspace."
                );
            } finally {
                setLoading(false);
            }
        }

        if (workspaceId) {
            loadWorkspace();
        }
    }, [workspaceId, router]);

    useEffect(() => {
        if (!workspaceId) {
            return;
        }

        async function loadProjects() {
            try {
                setProjectsLoading(true);
                setProjectsError("");

                const data = await getWorkspaceProjects(workspaceId);

                setProjects(data);
            } catch (err: any) {
                if (err && typeof err === "object") {
                    const messages = Object.values(err)
                        .flatMap((message) =>
                            Array.isArray(message)
                                ? message
                                : [message]
                        )
                        .filter(
                            (message) => typeof message === "string"
                        )
                        .join(" ");

                    setProjectsError(
                        messages || "Unable to load projects."
                    );
                } else {
                    setProjectsError("Unable to load projects.");
                }
            } finally {
                setProjectsLoading(false);
            }
        }

        loadProjects();
    }, [workspaceId]);

    const existingMemberIds = useMemo(() => {
        if (!workspace) {
            return new Set<number>();
        }

        return new Set(
            workspace.members.map((member) => member.user.id)
        );
    }, [workspace]);

    const filteredUsers = useMemo(() => {
        const search = userSearch.trim().toLowerCase();

        return users
            .filter((user) => !existingMemberIds.has(user.id))
            .filter((user) => {
                if (!search) {
                    return true;
                }

                const fullName =
                    `${user.first_name} ${user.last_name}`.trim();

                return (
                    user.username.toLowerCase().includes(search) ||
                    user.email.toLowerCase().includes(search) ||
                    fullName.toLowerCase().includes(search)
                );
            });
    }, [users, userSearch, existingMemberIds]);

    const owner = workspace?.members.find(
        (member) => member.role === "owner"
    );

    const currentMember = workspace?.members.find(
        (member) => member.user.id === currentUserId
    );

    const currentRole = currentMember?.role || "member";

    const canManageWorkspace =
        currentRole === "owner" || currentRole === "admin";

    const canDeleteWorkspace = currentRole === "owner";

    const canInviteMembers =
        currentRole === "owner" || currentRole === "admin";

    const canCreateProject =
        currentRole === "owner" || currentRole === "admin";

    const canManageMember = (
        targetRole: "owner" | "admin" | "member"
    ) => {
        if (currentRole === "owner") {
            return targetRole !== "owner";
        }

        if (currentRole === "admin") {
            return targetRole === "member";
        }

        return false;
    };

    const handleOpenEditPanel = () => {
        if (!workspace || !canManageWorkspace) {
            return;
        }

        setName(workspace.name);
        setDescription(workspace.description || "");
        setIsArchived(workspace.is_archived);
        setSaveError("");
        setShowEditPanel(true);
    };

    const handleUpdateWorkspace = async () => {
        if (!workspace || !canManageWorkspace) {
            return;
        }

        setSaving(true);
        setSaveError("");

        try {
            const updated = await updateWorkspace(workspace.id, {
                name,
                description,
                is_archived: isArchived,
            });

            setWorkspace(updated);
            setShowEditPanel(false);
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .flatMap((message) =>
                        Array.isArray(message)
                            ? message
                            : [message]
                    )
                    .filter(
                        (message) => typeof message === "string"
                    )
                    .join(" ");

                setSaveError(
                    messages || "Unable to update workspace."
                );
            } else {
                setSaveError("Unable to update workspace.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteWorkspace = async () => {
        if (!workspace || !canDeleteWorkspace) {
            return;
        }

        setDeleting(true);
        setDeleteError("");

        try {
            await deleteWorkspace(workspace.id);
            router.push("/workspaces");
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .flatMap((message) =>
                        Array.isArray(message)
                            ? message
                            : [message]
                    )
                    .filter(
                        (message) => typeof message === "string"
                    )
                    .join(" ");

                setDeleteError(
                    messages || "Unable to delete workspace."
                );
            } else {
                setDeleteError("Unable to delete workspace.");
            }
        } finally {
            setDeleting(false);
        }
    };

    const handleOpenInvitePanel = async () => {
        if (!canInviteMembers) {
            return;
        }

        setShowInvitePanel(true);
        setUserSearch("");
        setUsersError("");
        setInviteError("");

        if (users.length > 0) {
            return;
        }

        setLoadingUsers(true);

        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .flatMap((message) =>
                        Array.isArray(message)
                            ? message
                            : [message]
                    )
                    .filter(
                        (message) => typeof message === "string"
                    )
                    .join(" ");

                setUsersError(
                    messages || "Unable to load users."
                );
            } else {
                setUsersError("Unable to load users.");
            }
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleInviteUser = async (userId: number) => {
        if (!workspace || !canInviteMembers) {
            return;
        }

        setInvitingUserId(userId);
        setInviteError("");

        try {
            await sendWorkspaceInvitation(
                workspace.id,
                userId,
                inviteRole
            );

            setInvitedUserIds((previous) => [
                ...previous,
                userId,
            ]);
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .flatMap((message) =>
                        Array.isArray(message)
                            ? message
                            : [message]
                    )
                    .filter(
                        (message) => typeof message === "string"
                    )
                    .join(" ");

                setInviteError(
                    messages || "Unable to send invitation."
                );
            } else {
                setInviteError("Unable to send invitation.");
            }
        } finally {
            setInvitingUserId(null);
        }
    };

    const handlePromoteMember = async (userId: number) => {
        if (!workspace || currentRole !== "owner") {
            return;
        }

        const targetMember = workspace.members.find(
            (member) => member.user.id === userId
        );

        if (!targetMember || targetMember.role !== "member") {
            return;
        }

        setPromotingUserId(userId);
        setMemberActionError("");

        try {
            const updatedMember = await promoteWorkspaceMember(
                workspace.id,
                userId
            );

            setWorkspace((previous) => {
                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    members: previous.members.map((member) =>
                        member.user.id === userId
                            ? {
                                ...member,
                                role: updatedMember.role,
                            }
                            : member
                    ),
                };
            });
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .flatMap((message) =>
                        Array.isArray(message)
                            ? message
                            : [message]
                    )
                    .filter(
                        (message) => typeof message === "string"
                    )
                    .join(" ");

                setMemberActionError(
                    messages || "Unable to promote member."
                );
            } else {
                setMemberActionError(
                    "Unable to promote member."
                );
            }
        } finally {
            setPromotingUserId(null);
        }
    };

    const handleDemoteMember = async (userId: number) => {
        if (!workspace || currentRole !== "owner") {
            return;
        }

        const targetMember = workspace.members.find(
            (member) => member.user.id === userId
        );

        if (!targetMember || targetMember.role !== "admin") {
            return;
        }

        setDemotingUserId(userId);
        setMemberActionError("");

        try {
            const updatedMember = await demoteWorkspaceMember(
                workspace.id,
                userId
            );

            setWorkspace((previous) => {
                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    members: previous.members.map((member) =>
                        member.user.id === userId
                            ? {
                                ...member,
                                role: updatedMember.role,
                            }
                            : member
                    ),
                };
            });
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .flatMap((message) =>
                        Array.isArray(message)
                            ? message
                            : [message]
                    )
                    .filter(
                        (message) => typeof message === "string"
                    )
                    .join(" ");

                setMemberActionError(
                    messages || "Unable to demote member."
                );
            } else {
                setMemberActionError(
                    "Unable to demote member."
                );
            }
        } finally {
            setDemotingUserId(null);
        }
    };

    const handleRemoveMember = async (userId: number) => {
        if (!workspace) {
            return;
        }

        const targetMember = workspace.members.find(
            (member) => member.user.id === userId
        );

        if (!targetMember || !canManageMember(targetMember.role)) {
            return;
        }

        setRemovingUserId(userId);
        setMemberActionError("");

        try {
            await removeWorkspaceMember(
                workspace.id,
                userId
            );

            setWorkspace((previous) => {
                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    members: previous.members.filter(
                        (member) => member.user.id !== userId
                    ),
                    members_count: Math.max(
                        0,
                        previous.members_count - 1
                    ),
                };
            });
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .flatMap((message) =>
                        Array.isArray(message)
                            ? message
                            : [message]
                    )
                    .filter(
                        (message) => typeof message === "string"
                    )
                    .join(" ");

                setMemberActionError(
                    messages || "Unable to remove member."
                );
            } else {
                setMemberActionError("Unable to remove member.");
            }
        } finally {
            setRemovingUserId(null);
        }
    };

    const handleOpenProjectPanel = () => {
        if (!workspace || !canCreateProject) {
            return;
        }

        setProjectName("");
        setProjectDescription("");
        setProjectStartDate("");
        setProjectDueDate("");
        setProjectStatus("active");
        setProjectPriority("medium");
        setProjectError("");
        setShowProjectPanel(true);
    };

    const handleCreateProject = async () => {
        if (!workspace || !canCreateProject) {
            return;
        }

        setCreatingProject(true);
        setProjectError("");

        try {
            const createdProject = await createProject({
                name: projectName.trim(),
                description: projectDescription.trim(),
                workspace_id: workspace.id,
                status: projectStatus,
                priority: projectPriority,
                start_date: projectStartDate,
                due_date: projectDueDate,
            });

            const workspaceProject: WorkspaceProject = {
                id: createdProject.id,
                name: createdProject.name,
                description: createdProject.description,
                workspace: workspace.id,
                status: createdProject.status,
                priority: createdProject.priority,
                start_date: createdProject.start_date,
                due_date: createdProject.due_date,
                created_at: createdProject.created_at,
                updated_at: createdProject.updated_at,
            };

            setProjects((previous) => [
                ...previous,
                workspaceProject,
            ]);

            setShowProjectPanel(false);

            setProjectName("");
            setProjectDescription("");
            setProjectStartDate("");
            setProjectDueDate("");
            setProjectStatus("active");
            setProjectPriority("medium");

            setWorkspace((previous) => {
                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    projects_count:
                        previous.projects_count + 1,
                };
            });
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .flatMap((message) =>
                        Array.isArray(message)
                            ? message
                            : [message]
                    )
                    .filter(
                        (message) => typeof message === "string"
                    )
                    .join(" ");

                setProjectError(
                    messages || "Unable to create project."
                );
            } else {
                setProjectError(
                    "Unable to create project."
                );
            }
        } finally {
            setCreatingProject(false);
        }
    };

    if (loading) {
        return <WorkspaceDetailSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#020617] text-slate-50">
                <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6">
                    <div className="w-full max-w-md rounded-3xl border border-rose-500/20 bg-[#111827] p-8 text-center shadow-2xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-xl font-semibold text-rose-400">
                            !
                        </div>

                        <h1 className="mt-5 text-xl font-semibold text-slate-50">
                            Unable to load workspace
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/workspaces")
                            }
                            className="mt-6 w-full cursor-pointer rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                        >
                            Back to Workspaces
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!workspace) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/workspaces")
                        }
                        className="group flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-slate-50"
                    >
                        <span className="transition group-hover:-translate-x-0.5">
                            ←
                        </span>
                        Workspaces
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                        {canManageWorkspace && (
                            <button
                                type="button"
                                onClick={handleOpenEditPanel}
                                className="cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-[#111827] hover:text-white"
                            >
                                Edit workspace
                            </button>
                        )}

                        {canDeleteWorkspace && (
                            <button
                                type="button"
                                onClick={() => {
                                    setDeleteError("");
                                    setShowDeleteModal(true);
                                }}
                                className="cursor-pointer rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-500/15"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative mt-7 overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="min-w-0">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                                        Workspace
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${workspace.is_archived
                                            ? "bg-amber-500/10 text-amber-400"
                                            : "bg-emerald-500/10 text-emerald-400"
                                            }`}
                                    >
                                        {workspace.is_archived
                                            ? "Archived"
                                            : "Active"}
                                    </span>
                                </div>

                                <h1 className="break-words text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                                    {workspace.name}
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                                    {workspace.description ||
                                        "No workspace description provided."}
                                </p>
                            </div>

                            {canCreateProject && (
                                <button
                                    type="button"
                                    onClick={
                                        handleOpenProjectPanel
                                    }
                                    className="w-full shrink-0 cursor-pointer rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:w-auto"
                                >
                                    Create project
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Members
                        </p>

                        <p className="mt-3 text-2xl font-bold text-slate-50">
                            {workspace.members_count}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Projects
                        </p>

                        <p className="mt-3 text-2xl font-bold text-slate-50">
                            {workspace.projects_count}
                        </p>
                    </div>

                    <div className="min-w-0 rounded-2xl border border-slate-800 bg-[#111827] p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Created by
                        </p>

                        <p className="mt-3 truncate text-sm font-semibold text-slate-200">
                            {owner?.user.username ||
                                "Unknown"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Your role
                        </p>

                        <p className="mt-3 text-sm font-semibold capitalize text-indigo-400">
                            {currentRole}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 lg:col-span-2">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-50">
                                    Workspace information
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Key details and current status.
                                </p>
                            </div>

                            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 sm:flex">
                                #
                            </div>
                        </div>

                        <div className="mt-6 divide-y divide-slate-800">
                            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                                <span className="text-sm text-slate-500">
                                    Workspace ID
                                </span>

                                <span className="font-mono text-sm text-slate-300">
                                    #{workspace.id}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                                <span className="text-sm text-slate-500">
                                    Created
                                </span>

                                <span className="text-sm text-slate-300">
                                    {new Date(
                                        workspace.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                                <span className="text-sm text-slate-500">
                                    Last updated
                                </span>

                                <span className="text-sm text-slate-300">
                                    {new Date(
                                        workspace.updated_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                                <span className="text-sm text-slate-500">
                                    Status
                                </span>

                                <span
                                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${workspace.is_archived
                                        ? "bg-amber-500/10 text-amber-400"
                                        : "bg-emerald-500/10 text-emerald-400"
                                        }`}
                                >
                                    {workspace.is_archived
                                        ? "Archived"
                                        : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-50">
                                Workspace owner
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                The person who created this workspace.
                            </p>
                        </div>

                        {owner ? (
                            <div className="mt-6">
                                <div className="flex items-center gap-4">
                                    {owner.user.profile_picture ? (
                                        <img
                                            src={
                                                owner.user.profile_picture.startsWith(
                                                    "http"
                                                )
                                                    ? owner.user.profile_picture
                                                    : `${process.env.NEXT_PUBLIC_API_URL?.replace(
                                                        "/api",
                                                        ""
                                                    )}${owner.user.profile_picture}`
                                            }
                                            alt={
                                                owner.user.username
                                            }
                                            className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-1 ring-slate-700"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-sm font-bold text-indigo-400 ring-1 ring-indigo-500/10">
                                            {owner.user.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-50">
                                            {owner.user.first_name ||
                                                owner.user.username}
                                        </p>

                                        <p className="mt-0.5 truncate text-sm text-slate-500">
                                            @{owner.user.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                                            Email
                                        </p>

                                        <p className="mt-1 break-all text-sm text-slate-300">
                                            {owner.user.email}
                                        </p>
                                    </div>

                                    {owner.user.phone_number && (
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                                                Phone
                                            </p>

                                            <p className="mt-1 text-sm text-slate-300">
                                                {
                                                    owner.user
                                                        .phone_number
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="mt-6 rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
                                Owner information unavailable.
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                    <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-slate-50">
                                    Members
                                </h2>

                                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-400">
                                    {workspace.members_count}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                People who belong to this workspace.
                            </p>
                        </div>

                        {canInviteMembers && (
                            <button
                                type="button"
                                onClick={handleOpenInvitePanel}
                                className="w-full cursor-pointer rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:w-auto"
                            >
                                Invite member
                            </button>
                        )}
                    </div>

                    {memberActionError && (
                        <div className="border-b border-rose-500/20 bg-rose-500/10 px-5 py-3 text-sm text-rose-400 sm:px-6">
                            {memberActionError}
                        </div>
                    )}

                    <div className="divide-y divide-slate-800">
                        {workspace.members.length > 0 ? (
                            workspace.members.map((member) => {
                                const canManage =
                                    canManageMember(
                                        member.role
                                    );

                                return (
                                    <div
                                        key={member.id}
                                        className="flex flex-col gap-4 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            {member.user.profile_picture ? (
                                                <img
                                                    src={
                                                        member.user.profile_picture.startsWith(
                                                            "http"
                                                        )
                                                            ? member
                                                                .user
                                                                .profile_picture
                                                            : `${process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                "/api",
                                                                ""
                                                            )}${member.user.profile_picture}`
                                                    }
                                                    alt={
                                                        member
                                                            .user
                                                            .username
                                                    }
                                                    className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-slate-800"
                                                />
                                            ) : (
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-slate-300">
                                                    {member.user.username
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-50">
                                                    {member.user
                                                        .first_name ||
                                                        member.user
                                                            .username}
                                                    {member.user
                                                        .last_name
                                                        ? ` ${member.user.last_name}`
                                                        : ""}
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                    @
                                                    {
                                                        member
                                                            .user
                                                            .username
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        member
                                                            .user
                                                            .email
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                            {canManage &&
                                                currentRole ===
                                                "owner" &&
                                                member.role ===
                                                "member" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handlePromoteMember(
                                                                member
                                                                    .user
                                                                    .id
                                                            )
                                                        }
                                                        disabled={
                                                            promotingUserId ===
                                                            member
                                                                .user
                                                                .id ||
                                                            removingUserId ===
                                                            member
                                                                .user
                                                                .id
                                                        }
                                                        className="cursor-pointer rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {promotingUserId ===
                                                            member
                                                                .user
                                                                .id
                                                            ? "Promoting..."
                                                            : "Promote"}
                                                    </button>
                                                )}

                                            {canManage &&
                                                currentRole ===
                                                "owner" &&
                                                member.role ===
                                                "admin" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDemoteMember(
                                                                member
                                                                    .user
                                                                    .id
                                                            )
                                                        }
                                                        disabled={
                                                            demotingUserId ===
                                                            member
                                                                .user
                                                                .id ||
                                                            removingUserId ===
                                                            member
                                                                .user
                                                                .id
                                                        }
                                                        className="cursor-pointer rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {demotingUserId ===
                                                            member
                                                                .user
                                                                .id
                                                            ? "Demoting..."
                                                            : "Demote"}
                                                    </button>
                                                )}

                                            {canManage && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            member
                                                                .user
                                                                .id
                                                        )
                                                    }
                                                    disabled={
                                                        removingUserId ===
                                                        member
                                                            .user
                                                            .id ||
                                                        promotingUserId ===
                                                        member
                                                            .user
                                                            .id ||
                                                        demotingUserId ===
                                                        member
                                                            .user
                                                            .id
                                                    }
                                                    className="cursor-pointer rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {removingUserId ===
                                                        member
                                                            .user
                                                            .id
                                                        ? "Removing..."
                                                        : "Remove"}
                                                </button>
                                            )}

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${member.role ===
                                                    "owner"
                                                    ? "bg-indigo-500/10 text-indigo-400"
                                                    : member.role ===
                                                        "admin"
                                                        ? "bg-amber-500/10 text-amber-400"
                                                        : "bg-slate-800 text-slate-400"
                                                    }`}
                                            >
                                                {member.role}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-6 py-14 text-center">
                                <p className="text-sm text-slate-500">
                                    No members found.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                    <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-slate-50">
                                    Projects
                                </h2>

                                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-400">
                                    {workspace.projects_count}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Projects associated with this workspace.
                            </p>
                        </div>

                        {canCreateProject && (
                            <button
                                type="button"
                                onClick={
                                    handleOpenProjectPanel
                                }
                                className="w-full cursor-pointer rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:w-auto"
                            >
                                Create project
                            </button>
                        )}
                    </div>

                    <div className="p-5 sm:p-6">
                        {projectsLoading ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {[1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="animate-pulse rounded-2xl border border-slate-800 bg-[#0F172A] p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="w-full">
                                                <div className="h-5 w-2/3 rounded bg-slate-800" />
                                                <div className="mt-3 h-4 w-full rounded bg-slate-800" />
                                                <div className="mt-2 h-4 w-4/5 rounded bg-slate-800" />
                                            </div>

                                            <div className="h-8 w-8 rounded-lg bg-slate-800" />
                                        </div>

                                        <div className="mt-6 flex gap-4">
                                            <div className="h-3 w-24 rounded bg-slate-800" />
                                            <div className="h-3 w-24 rounded bg-slate-800" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : projectsError ? (
                            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-5 py-4">
                                <p className="text-sm text-rose-400">
                                    {projectsError}
                                </p>
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        type="button"
                                        onClick={() =>
                                            router.push(
                                                `/projects/${project.id}`
                                            )
                                        }
                                        className="group cursor-pointer rounded-2xl border border-slate-800 bg-[#0F172A] p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-[#111827]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

                                                    <h3 className="truncate text-base font-semibold text-slate-50 transition group-hover:text-indigo-400">
                                                        {project.name}
                                                    </h3>
                                                </div>

                                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-500 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                                                →
                                            </span>
                                        </div>

                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-slate-400">
                                                Start:{" "}
                                                {project.start_date
                                                    ? new Date(
                                                        project.start_date
                                                    ).toLocaleDateString()
                                                    : "Not set"}
                                            </span>

                                            <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-slate-400">
                                                Due:{" "}
                                                {project.due_date
                                                    ? new Date(
                                                        project.due_date
                                                    ).toLocaleDateString()
                                                    : "Not set"}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-800 px-6 py-14 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                                    +
                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-300">
                                    No projects yet
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Create a project to start organizing work.
                                </p>

                                {canCreateProject && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleOpenProjectPanel
                                        }
                                        className="mt-5 cursor-pointer rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                                    >
                                        Create your first project
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showEditPanel && canManageWorkspace && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
                    <div className="h-full w-full max-w-lg overflow-y-auto border-l border-slate-800 bg-[#020617] shadow-2xl">
                        <div className="sticky top-0 z-10 border-b border-slate-800 bg-[#020617]/95 px-5 py-5 backdrop-blur sm:px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                        Workspace settings
                                    </span>

                                    <h2 className="mt-1 text-xl font-semibold text-slate-50">
                                        Edit workspace
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Update workspace details and status.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditPanel(false)
                                    }
                                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-800 hover:text-white"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6 px-5 py-6 sm:px-6">
                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    rows={5}
                                    className="mt-2 w-full resize-none rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-200">
                                        Archive workspace
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Archived workspaces are no longer active.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={isArchived}
                                    onChange={(event) =>
                                        setIsArchived(
                                            event.target.checked
                                        )
                                    }
                                    className="h-5 w-5 cursor-pointer accent-indigo-500"
                                />
                            </label>

                            {saveError && (
                                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-5 text-rose-400">
                                    {saveError}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={
                                    handleUpdateWorkspace
                                }
                                disabled={saving}
                                className="w-full cursor-pointer rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInvitePanel && canInviteMembers && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
                    <div className="flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-[#020617] shadow-2xl">
                        <div className="border-b border-slate-800 px-5 py-5 sm:px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                        Members
                                    </span>

                                    <h2 className="mt-1 text-xl font-semibold text-slate-50">
                                        Invite member
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Find a user and send a workspace invitation.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowInvitePanel(
                                            false
                                        )
                                    }
                                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-800 hover:text-white"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mt-6">
                                <input
                                    value={userSearch}
                                    onChange={(event) =>
                                        setUserSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search username, name or email..."
                                    className="w-full rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Invitation role
                                </label>

                                <select
                                    value={inviteRole}
                                    onChange={(event) =>
                                        setInviteRole(
                                            event.target
                                                .value as
                                            | "admin"
                                            | "member"
                                        )
                                    }
                                    className="mt-2 w-full cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                >
                                    <option value="member">
                                        Member
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                            {inviteError && (
                                <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                                    {inviteError}
                                </div>
                            )}

                            {usersError && (
                                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                                    {usersError}
                                </div>
                            )}

                            {loadingUsers ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="animate-pulse rounded-2xl border border-slate-800 bg-[#0F172A] p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-11 rounded-xl bg-slate-800" />

                                                    <div className="flex-1">
                                                        <div className="h-4 w-32 rounded bg-slate-800" />
                                                        <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
                                                    </div>

                                                    <div className="h-9 w-16 rounded-lg bg-slate-800" />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredUsers.map(
                                        (user) => {
                                            const invited =
                                                invitedUserIds.includes(
                                                    user.id
                                                );

                                            const fullName =
                                                `${user.first_name} ${user.last_name}`.trim();

                                            return (
                                                <div
                                                    key={
                                                        user.id
                                                    }
                                                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#0F172A] p-4 transition hover:border-slate-700"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        {user.profile_picture ? (
                                                            <img
                                                                src={
                                                                    user.profile_picture.startsWith(
                                                                        "http"
                                                                    )
                                                                        ? user.profile_picture
                                                                        : `${process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                            "/api",
                                                                            ""
                                                                        )}${user.profile_picture}`
                                                                }
                                                                alt={
                                                                    user.username
                                                                }
                                                                className="h-11 w-11 shrink-0 rounded-xl object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-400">
                                                                {user.username
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-slate-50">
                                                                {fullName ||
                                                                    user.username}
                                                            </p>

                                                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                                                @
                                                                {
                                                                    user.username
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleInviteUser(
                                                                user.id
                                                            )
                                                        }
                                                        disabled={
                                                            invited ||
                                                            invitingUserId ===
                                                            user.id
                                                        }
                                                        className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${invited
                                                            ? "cursor-default bg-emerald-500/10 text-emerald-400"
                                                            : "cursor-pointer bg-indigo-500 text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                            }`}
                                                    >
                                                        {invitingUserId ===
                                                            user.id
                                                            ? "Sending..."
                                                            : invited
                                                                ? "Invited"
                                                                : "Invite"}
                                                    </button>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-800 px-5 py-12 text-center">
                                    <p className="text-sm font-medium text-slate-300">
                                        {userSearch
                                            ? "No matching users"
                                            : "No users available"}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {userSearch
                                            ? "Try a different search."
                                            : "There are no users available to invite."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showProjectPanel && canCreateProject && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
                    <div className="flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-[#020617] shadow-2xl">
                        <div className="border-b border-slate-800 px-5 py-5 sm:px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                        Projects
                                    </span>

                                    <h2 className="mt-1 text-xl font-semibold text-slate-50">
                                        Create project
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Add a new project to this workspace.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowProjectPanel(
                                            false
                                        )
                                    }
                                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-800 hover:text-white"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-sm font-medium text-slate-300">
                                        Project name
                                    </label>

                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(event) =>
                                            setProjectName(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter project name"
                                        className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-300">
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            projectDescription
                                        }
                                        onChange={(event) =>
                                            setProjectDescription(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter project description"
                                        rows={5}
                                        className="mt-2 w-full resize-none rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                    />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300">
                                            Status
                                        </label>

                                        <select
                                            value={projectStatus}
                                            onChange={(event) =>
                                                setProjectStatus(
                                                    event.target.value as ProjectStatus
                                                )
                                            }
                                            className="mt-2 w-full cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                        >
                                            <option value="planning">
                                                Planning
                                            </option>

                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>

                                            <option value="archived">
                                                Archived
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-300">
                                            Priority
                                        </label>

                                        <select
                                            value={projectPriority}
                                            onChange={(event) =>
                                                setProjectPriority(
                                                    event.target.value as ProjectPriority
                                                )
                                            }
                                            className="mt-2 w-full cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                        >
                                            <option value="low">
                                                Low
                                            </option>

                                            <option value="medium">
                                                Medium
                                            </option>

                                            <option value="high">
                                                High
                                            </option>

                                            <option value="urgent">
                                                Urgent
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300">
                                            Start date
                                        </label>

                                        <input
                                            type="date"
                                            value={
                                                projectStartDate
                                            }
                                            onChange={(event) =>
                                                setProjectStartDate(
                                                    event.target
                                                        .value
                                                )
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-300">
                                            Due date
                                        </label>

                                        <input
                                            type="date"
                                            value={projectDueDate}
                                            onChange={(event) =>
                                                setProjectDueDate(
                                                    event.target
                                                        .value
                                                )
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                        />
                                    </div>
                                </div>

                                {projectError && (
                                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-5 text-rose-400">
                                        {projectError}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={
                                        handleCreateProject
                                    }
                                    disabled={
                                        creatingProject ||
                                        !projectName.trim() ||
                                        !projectDescription.trim()
                                    }
                                    className="w-full cursor-pointer rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {creatingProject
                                        ? "Creating..."
                                        : "Create project"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && canDeleteWorkspace && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-2xl sm:p-7">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-xl font-semibold text-rose-400">
                            !
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-slate-50">
                            Delete workspace?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            This will permanently delete{" "}
                            <span className="font-semibold text-slate-200">
                                {workspace.name}
                            </span>
                            . This action cannot be undone.
                        </p>

                        {deleteError && (
                            <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                                disabled={deleting}
                                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDeleteWorkspace
                                }
                                disabled={deleting}
                                className="w-full cursor-pointer rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete workspace"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}