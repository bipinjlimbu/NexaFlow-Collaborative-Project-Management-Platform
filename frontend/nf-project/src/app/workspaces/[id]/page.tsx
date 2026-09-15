"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    deleteWorkspace,
    demoteWorkspaceMember,
    getUsers,
    getWorkspace,
    promoteWorkspaceMember,
    sendWorkspaceInvitation,
    updateWorkspace,
    WorkspaceDetail,
    WorkspaceUser,
} from "@/services/workspaceService";
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

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isArchived, setIsArchived] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [users, setUsers] = useState<WorkspaceUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");
    const [userSearch, setUserSearch] = useState("");

    const [invitingUserId, setInvitingUserId] = useState<number | null>(null);
    const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);
    const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
    const [inviteError, setInviteError] = useState("");

    const [promotingUserId, setPromotingUserId] = useState<number | null>(null);
    const [demotingUserId, setDemotingUserId] = useState<number | null>(null);
    const [memberActionError, setMemberActionError] = useState("");

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
                    .filter((message) => typeof message === "string")
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
                    .filter((message) => typeof message === "string")
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
                    .filter((message) => typeof message === "string")
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
                    .filter((message) => typeof message === "string")
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
                    .filter((message) => typeof message === "string")
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
                    .filter((message) => typeof message === "string")
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

    if (loading) {
        return <WorkspaceDetailSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900/60 p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                            !
                        </div>

                        <h1 className="mt-5 text-xl font-semibold">
                            Unable to load workspace
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => router.push("/workspaces")}
                            className="mt-6 cursor-pointer rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
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
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => router.push("/workspaces")}
                        className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
                    >
                        ← Workspaces
                    </button>

                    <div className="flex items-center gap-3">
                        {canManageWorkspace && (
                            <button
                                type="button"
                                onClick={handleOpenEditPanel}
                                className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
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
                                className="cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {workspace.name}
                            </h1>

                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${workspace.is_archived
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-emerald-500/10 text-emerald-400"
                                    }`}
                            >
                                {workspace.is_archived
                                    ? "Archived"
                                    : "Active"}
                            </span>
                        </div>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            {workspace.description ||
                                "No workspace description provided."}
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Members
                        </p>

                        <p className="mt-3 text-2xl font-semibold">
                            {workspace.members_count}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Projects
                        </p>

                        <p className="mt-3 text-2xl font-semibold">
                            {workspace.projects_count}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Created by
                        </p>

                        <p className="mt-3 truncate text-sm font-semibold text-slate-200">
                            {owner?.user.username || "Unknown"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Your role
                        </p>

                        <p className="mt-3 text-sm font-semibold capitalize text-indigo-400">
                            {currentRole}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 lg:col-span-2">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Workspace information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Basic details and workspace status.
                            </p>
                        </div>

                        <div className="mt-6 divide-y divide-slate-800/80">
                            <div className="flex items-center justify-between gap-6 py-4">
                                <span className="text-sm text-slate-500">
                                    Workspace ID
                                </span>

                                <span className="font-mono text-sm text-slate-300">
                                    #{workspace.id}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-6 py-4">
                                <span className="text-sm text-slate-500">
                                    Created
                                </span>

                                <span className="text-sm text-slate-300">
                                    {new Date(
                                        workspace.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-6 py-4">
                                <span className="text-sm text-slate-500">
                                    Last updated
                                </span>

                                <span className="text-sm text-slate-300">
                                    {new Date(
                                        workspace.updated_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-6 py-4">
                                <span className="text-sm text-slate-500">
                                    Status
                                </span>

                                <span className="text-sm capitalize text-slate-300">
                                    {workspace.is_archived
                                        ? "Archived"
                                        : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
                        <h2 className="text-lg font-semibold">
                            Workspace owner
                        </h2>

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
                                            alt={owner.user.username}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                            {owner.user.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-white">
                                            {owner.user.first_name ||
                                                owner.user.username}
                                        </p>

                                        <p className="truncate text-sm text-slate-500">
                                            @{owner.user.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-600">
                                            Email
                                        </p>

                                        <p className="mt-1 break-all text-sm text-slate-300">
                                            {owner.user.email}
                                        </p>
                                    </div>

                                    {owner.user.phone_number && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-slate-600">
                                                Phone
                                            </p>

                                            <p className="mt-1 text-sm text-slate-300">
                                                {owner.user.phone_number}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="mt-6 text-sm text-slate-500">
                                Owner information unavailable.
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/40">
                    <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Members
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                People who belong to this workspace.
                            </p>
                        </div>

                        {canInviteMembers && (
                            <button
                                type="button"
                                onClick={handleOpenInvitePanel}
                                className="cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
                            >
                                Invite member
                            </button>
                        )}
                    </div>

                    {memberActionError && (
                        <div className="border-b border-red-500/20 bg-red-500/10 px-6 py-3 text-sm text-red-400">
                            {memberActionError}
                        </div>
                    )}

                    <div className="divide-y divide-slate-800/80">
                        {workspace.members.length > 0 ? (
                            workspace.members.map((member) => {
                                const canManage =
                                    canManageMember(member.role);

                                return (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-4 px-6 py-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-4">
                                            {member.user.profile_picture ? (
                                                <img
                                                    src={
                                                        member.user.profile_picture.startsWith(
                                                            "http"
                                                        )
                                                            ? member.user.profile_picture
                                                            : `${process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                "/api",
                                                                ""
                                                            )}${member.user.profile_picture}`
                                                    }
                                                    alt={
                                                        member.user.username
                                                    }
                                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">
                                                    {member.user.username
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {member.user.first_name ||
                                                        member.user.username}
                                                    {member.user.last_name
                                                        ? ` ${member.user.last_name}`
                                                        : ""}
                                                </p>

                                                <p className="truncate text-xs text-slate-500">
                                                    @{member.user.username} ·{" "}
                                                    {member.user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            {canManage &&
                                                currentRole === "owner" &&
                                                member.role === "member" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handlePromoteMember(
                                                                member.user.id
                                                            )
                                                        }
                                                        disabled={
                                                            promotingUserId ===
                                                            member.user.id
                                                        }
                                                        className="cursor-pointer rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {promotingUserId ===
                                                            member.user.id
                                                            ? "Promoting..."
                                                            : "Promote"}
                                                    </button>
                                                )}

                                            {canManage &&
                                                currentRole === "owner" &&
                                                member.role === "admin" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDemoteMember(
                                                                member.user.id
                                                            )
                                                        }
                                                        disabled={
                                                            demotingUserId ===
                                                            member.user.id
                                                        }
                                                        className="cursor-pointer rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-400 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {demotingUserId ===
                                                            member.user.id
                                                            ? "Demoting..."
                                                            : "Demote"}
                                                    </button>
                                                )}

                                            {canManage && (
                                                <button
                                                    type="button"
                                                    className="cursor-pointer rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                                                >
                                                    Remove
                                                </button>
                                            )}

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${member.role === "owner"
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
                            <div className="px-6 py-12 text-center text-sm text-slate-500">
                                No members found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/40">
                    <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Projects
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Projects associated with this workspace.
                            </p>
                        </div>

                        {canCreateProject && (
                            <button
                                type="button"
                                className="cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
                            >
                                Create project
                            </button>
                        )}
                    </div>

                    <div className="px-6 py-12 text-center">
                        {workspace.projects_count > 0 ? (
                            <p className="text-sm text-slate-400">
                                {workspace.projects_count} project
                                {workspace.projects_count !== 1
                                    ? "s"
                                    : ""}{" "}
                                in this workspace.
                            </p>
                        ) : (
                            <p className="text-sm text-slate-500">
                                No projects in this workspace yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {showEditPanel && canManageWorkspace && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
                    <div className="h-full w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Edit workspace
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update workspace information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowEditPanel(false)
                                }
                                className="cursor-pointer text-xl text-slate-500 transition hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-8 space-y-5">
                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
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
                                    className="mt-2 w-full resize-none rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        Archive workspace
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Archived workspaces are no longer
                                        active.
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
                                    className="h-4 w-4 cursor-pointer accent-indigo-500"
                                />
                            </label>

                            {saveError && (
                                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                    {saveError}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleUpdateWorkspace}
                                disabled={saving}
                                className="w-full cursor-pointer rounded-lg bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
                    <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-950 shadow-2xl">
                        <div className="border-b border-slate-800 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Invite member
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Select a user to invite to this
                                        workspace.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowInvitePanel(false)
                                    }
                                    className="cursor-pointer text-xl text-slate-500 transition hover:text-white"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mt-5">
                                <input
                                    value={userSearch}
                                    onChange={(event) =>
                                        setUserSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search username, name or email..."
                                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                                />
                            </div>

                            <div className="mt-3">
                                <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Role
                                </label>

                                <select
                                    value={inviteRole}
                                    onChange={(event) =>
                                        setInviteRole(
                                            event.target.value as
                                            | "admin"
                                            | "member"
                                        )
                                    }
                                    className="mt-2 w-full cursor-pointer rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
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

                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {inviteError && (
                                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                    {inviteError}
                                </div>
                            )}

                            {usersError && (
                                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                    {usersError}
                                </div>
                            )}

                            {loadingUsers ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="h-16 animate-pulse rounded-lg bg-slate-900"
                                        />
                                    ))}
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredUsers.map((user) => {
                                        const invited =
                                            invitedUserIds.includes(
                                                user.id
                                            );

                                        const fullName =
                                            `${user.first_name} ${user.last_name}`.trim();

                                        return (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
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
                                                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                                            {user.username
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-white">
                                                            {fullName ||
                                                                user.username}
                                                        </p>

                                                        <p className="truncate text-xs text-slate-500">
                                                            @{user.username}
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
                                                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${invited
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
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-10 text-center">
                                    <p className="text-sm text-slate-400">
                                        {userSearch
                                            ? "No matching users found."
                                            : "No users available to invite."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && canDeleteWorkspace && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                            !
                        </div>

                        <h2 className="mt-5 text-xl font-semibold">
                            Delete workspace?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            This will permanently delete{" "}
                            <span className="font-medium text-slate-200">
                                {workspace.name}
                            </span>
                            . This action cannot be undone.
                        </p>

                        {deleteError && (
                            <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                                disabled={deleting}
                                className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteWorkspace}
                                disabled={deleting}
                                className="cursor-pointer rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
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