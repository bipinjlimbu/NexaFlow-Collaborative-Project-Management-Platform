"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    deleteWorkspace,
    getUsers,
    getWorkspace,
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

    const [showEditPanel, setShowEditPanel] = useState(false);
    const [showInvitePanel, setShowInvitePanel] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isArchived, setIsArchived] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [users, setUsers] = useState<WorkspaceUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");
    const [userSearch, setUserSearch] = useState("");

    useEffect(() => {
        const access = localStorage.getItem("access");

        if (!access) {
            router.push("/login");
            return;
        }

        async function loadWorkspace() {
            try {
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

        loadWorkspace();
    }, [router, workspaceId]);

    const handleOpenEdit = () => {
        if (!workspace) return;

        setName(workspace.name);
        setDescription(workspace.description || "");
        setIsArchived(workspace.is_archived);
        setSaveError("");
        setShowEditPanel(true);
    };

    const handleUpdateWorkspace = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!workspace) return;

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
            setSaveError(
                err?.detail ||
                err?.error ||
                "Unable to update workspace."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteWorkspace = async () => {
        if (!workspace) return;

        setDeleting(true);
        setDeleteError("");

        try {
            await deleteWorkspace(workspace.id);
            router.push("/workspaces");
        } catch (err: any) {
            setDeleteError(
                err?.detail ||
                err?.error ||
                "Unable to delete workspace."
            );
            setDeleting(false);
        }
    };

    const handleOpenInvitePanel = async () => {
        setShowInvitePanel(true);
        setUserSearch("");
        setUsersError("");

        if (users.length > 0) return;

        setLoadingUsers(true);

        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err: any) {
            setUsersError(
                err?.detail ||
                err?.error ||
                "Unable to load users."
            );
        } finally {
            setLoadingUsers(false);
        }
    };

    const existingMemberIds = useMemo(() => {
        if (!workspace) return new Set<number>();

        return new Set(
            workspace.members.map((member) => member.user.id)
        );
    }, [workspace]);

    const filteredUsers = useMemo(() => {
        const search = userSearch.trim().toLowerCase();

        return users
            .filter((user) => !existingMemberIds.has(user.id))
            .filter((user) => {
                if (!search) return true;

                const fullName =
                    `${user.first_name} ${user.last_name}`.trim();

                return (
                    user.username.toLowerCase().includes(search) ||
                    user.email.toLowerCase().includes(search) ||
                    fullName.toLowerCase().includes(search)
                );
            });
    }, [users, userSearch, existingMemberIds]);

    const getUserName = (user: WorkspaceUser) => {
        const fullName =
            `${user.first_name} ${user.last_name}`.trim();

        return fullName || user.username;
    };

    const getProfileImage = (profilePicture: string | null) => {
        if (!profilePicture) return null;

        if (profilePicture.startsWith("http")) {
            return profilePicture;
        }

        return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${profilePicture}`;
    };

    if (loading) {
        return <WorkspaceDetailSkeleton />;
    }

    if (error || !workspace) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                        <p className="text-sm text-red-400">
                            {error || "Workspace not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const owner = workspace.members.find(
        (member) => member.role === "owner"
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push("/workspaces")}
                        className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
                    >
                        ← Workspaces
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleOpenEdit}
                            className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500/50 hover:bg-slate-800"
                        >
                            Edit workspace
                        </button>

                        <button
                            onClick={() => {
                                setDeleteError("");
                                setShowDeleteModal(true);
                            }}
                            className="cursor-pointer rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {workspace.name}
                            </h1>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${workspace.is_archived
                                        ? "bg-amber-500/10 text-amber-400"
                                        : "bg-emerald-500/10 text-emerald-400"
                                    }`}
                            >
                                {workspace.is_archived
                                    ? "Archived"
                                    : "Active"}
                            </span>
                        </div>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                            {workspace.description ||
                                "No workspace description provided."}
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                            Members
                        </p>
                        <p className="mt-3 text-2xl font-semibold">
                            {workspace.members_count}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                            Projects
                        </p>
                        <p className="mt-3 text-2xl font-semibold">
                            {workspace.projects_count}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                            Created by
                        </p>
                        <p className="mt-3 truncate text-sm font-medium text-slate-200">
                            {owner?.user.username || "Unknown"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                            Your role
                        </p>
                        <p className="mt-3 text-sm font-medium capitalize text-indigo-400">
                            {owner?.role || "Member"}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold">
                            Workspace information
                        </h2>

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
                            Owner
                        </h2>

                        {owner ? (
                            <div className="mt-6 flex items-center gap-4">
                                {getProfileImage(
                                    owner.user.profile_picture
                                ) ? (
                                    <img
                                        src={
                                            getProfileImage(
                                                owner.user.profile_picture
                                            ) || ""
                                        }
                                        alt={getUserName(owner.user)}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                        {getUserName(
                                            owner.user
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-200">
                                        {getUserName(owner.user)}
                                    </p>
                                    <p className="mt-1 truncate text-sm text-slate-500">
                                        @{owner.user.username}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-slate-600">
                                        {owner.user.email}
                                    </p>
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
                                People who currently have access to this workspace.
                            </p>
                        </div>

                        <button
                            onClick={handleOpenInvitePanel}
                            className="cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
                        >
                            Invite member
                        </button>
                    </div>

                    <div className="divide-y divide-slate-800/80">
                        {workspace.members.length > 0 ? (
                            workspace.members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between gap-4 px-6 py-5"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        {getProfileImage(
                                            member.user.profile_picture
                                        ) ? (
                                            <img
                                                src={
                                                    getProfileImage(
                                                        member.user
                                                            .profile_picture
                                                    ) || ""
                                                }
                                                alt={getUserName(
                                                    member.user
                                                )}
                                                className="h-11 w-11 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">
                                                {getUserName(
                                                    member.user
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-200">
                                                {getUserName(
                                                    member.user
                                                )}
                                            </p>
                                            <p className="truncate text-sm text-slate-500">
                                                @{member.user.username}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${member.role === "owner"
                                                ? "bg-indigo-500/10 text-indigo-400"
                                                : member.role === "admin"
                                                    ? "bg-amber-500/10 text-amber-400"
                                                    : "bg-slate-800 text-slate-400"
                                            }`}
                                    >
                                        {member.role}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-10 text-center">
                                <p className="text-sm text-slate-500">
                                    No members found.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/40">
                    <div className="border-b border-slate-800/80 px-6 py-5">
                        <h2 className="text-lg font-semibold">
                            Projects
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Projects belonging to this workspace.
                        </p>
                    </div>

                    <div className="px-6 py-10 text-center">
                        <p className="text-sm text-slate-500">
                            {workspace.projects_count === 0
                                ? "No projects in this workspace yet."
                                : `${workspace.projects_count} project${workspace.projects_count === 1
                                    ? ""
                                    : "s"
                                } in this workspace.`}
                        </p>
                    </div>
                </div>
            </div>

            {showEditPanel && (
                <div className="fixed inset-0 z-50">
                    <button
                        onClick={() => setShowEditPanel(false)}
                        className="absolute inset-0 h-full w-full cursor-pointer bg-black/60 backdrop-blur-sm"
                        aria-label="Close edit panel"
                    />

                    <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Edit workspace
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Update workspace details.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowEditPanel(false)}
                                className="cursor-pointer text-2xl text-slate-500 transition hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateWorkspace}
                            className="mt-8 space-y-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                                    placeholder="Workspace name"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    rows={5}
                                    className="w-full resize-none rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                                    placeholder="Workspace description"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        Archived
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Archive this workspace when it is no longer active.
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
                                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                                    {saveError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full cursor-pointer rounded-lg bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showInvitePanel && (
                <div className="fixed inset-0 z-50">
                    <button
                        onClick={() => setShowInvitePanel(false)}
                        className="absolute inset-0 h-full w-full cursor-pointer bg-black/60 backdrop-blur-sm"
                        aria-label="Close invite panel"
                    />

                    <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Invite member
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Search users and choose who to invite.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowInvitePanel(false)
                                }
                                className="cursor-pointer text-2xl text-slate-500 transition hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <input
                                    value={userSearch}
                                    onChange={(event) =>
                                        setUserSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search by name, username or email..."
                                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {usersError && (
                            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                                {usersError}
                            </div>
                        )}

                        <div className="mt-6">
                            {loadingUsers ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="h-20 animate-pulse rounded-xl border border-slate-800/80 bg-slate-900/40"
                                        />
                                    ))}
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition hover:border-slate-700"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                {getProfileImage(
                                                    user.profile_picture
                                                ) ? (
                                                    <img
                                                        src={
                                                            getProfileImage(
                                                                user.profile_picture
                                                            ) || ""
                                                        }
                                                        alt={getUserName(
                                                            user
                                                        )}
                                                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                                        {getUserName(
                                                            user
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-200">
                                                        {getUserName(
                                                            user
                                                        )}
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
                                                className="shrink-0 cursor-pointer rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-400 transition hover:bg-indigo-500/20"
                                            >
                                                Invite
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 px-6 py-10 text-center">
                                    <p className="text-sm text-slate-500">
                                        {userSearch.trim()
                                            ? "No users match your search."
                                            : "No users available to invite."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold">
                            Delete workspace?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            This will permanently delete{" "}
                            <span className="font-medium text-slate-200">
                                {workspace.name}
                            </span>{" "}
                            and its associated data. This action cannot be
                            undone.
                        </p>

                        {deleteError && (
                            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                                disabled={deleting}
                                className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteWorkspace}
                                disabled={deleting}
                                className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
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