"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    getWorkspace,
    WorkspaceDetail,
} from "@/services/workspaceService";
import WorkspaceDetailSkeleton from "@/components/WorkspaceDetailSkeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
}

function formatShortDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function getFullName(
    firstName: string,
    lastName: string,
    username: string
) {
    const name = `${firstName} ${lastName}`.trim();
    return name || username;
}

export default function WorkspaceDetailPage() {
    const params = useParams();
    const router = useRouter();

    const [workspace, setWorkspace] =
        useState<WorkspaceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const access = localStorage.getItem("access");

        if (!access) {
            router.replace("/login");
            return;
        }

        const loadWorkspace = async () => {
            try {
                setLoading(true);
                setError("");

                const id = Number(params.id);

                if (!id) {
                    setError("Invalid workspace.");
                    return;
                }

                const data = await getWorkspace(id);
                setWorkspace(data);
            } catch (err: any) {
                setError(
                    err?.detail ||
                    err?.error ||
                    "Unable to load workspace."
                );
            } finally {
                setLoading(false);
            }
        };

        loadWorkspace();
    }, [params.id, router]);

    if (loading) {
        return <WorkspaceDetailSkeleton />;
    }

    if (error || !workspace) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                            !
                        </div>

                        <h1 className="mt-5 text-lg font-semibold">
                            Workspace unavailable
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            {error ||
                                "The workspace could not be found."}
                        </p>

                        <button
                            onClick={() => router.push("/workspaces")}
                            className="mt-6 cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                        >
                            Back to workspaces
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const owner =
        workspace.members.find(
            (member) => member.role === "owner"
        ) || workspace.members[0];

    const ownerName = owner
        ? getFullName(
            owner.user.first_name,
            owner.user.last_name,
            owner.user.username
        )
        : "Unknown";

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push("/workspaces")}
                        className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
                    >
                        ← Workspaces
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                        >
                            Edit workspace
                        </button>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="cursor-pointer rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/15"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <section className="mt-8 border-b border-slate-800/80 pb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-widest text-indigo-400">
                                Workspace
                            </p>

                            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                {workspace.name}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-slate-400">
                                {workspace.description ||
                                    "No workspace description provided."}
                            </p>
                        </div>

                        <div
                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${workspace.is_archived
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${workspace.is_archived
                                    ? "bg-amber-400"
                                    : "bg-emerald-400"
                                    }`}
                            />

                            {workspace.is_archived
                                ? "Archived"
                                : "Active"}
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
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

                        <p className="mt-3 truncate text-base font-semibold">
                            {ownerName}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                            Your role
                        </p>

                        <p className="mt-3 text-base font-semibold capitalize">
                            {owner?.role || "Member"}
                        </p>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <section className="rounded-xl border border-slate-800/80 bg-slate-900/40 lg:col-span-2">
                        <div className="border-b border-slate-800/80 px-6 py-5">
                            <p className="font-mono text-xs uppercase tracking-widest text-indigo-400">
                                Workspace information
                            </p>

                            <h2 className="mt-1 text-lg font-semibold">
                                Details
                            </h2>
                        </div>

                        <div className="divide-y divide-slate-800/70">
                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3">
                                <p className="text-sm text-slate-500">
                                    Workspace name
                                </p>

                                <p className="text-sm font-medium text-slate-200 sm:col-span-2">
                                    {workspace.name}
                                </p>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3">
                                <p className="text-sm text-slate-500">
                                    Description
                                </p>

                                <p className="text-sm text-slate-300 sm:col-span-2">
                                    {workspace.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3">
                                <p className="text-sm text-slate-500">
                                    Status
                                </p>

                                <p
                                    className={`text-sm font-medium sm:col-span-2 ${workspace.is_archived
                                        ? "text-amber-400"
                                        : "text-emerald-400"
                                        }`}
                                >
                                    {workspace.is_archived
                                        ? "Archived"
                                        : "Active"}
                                </p>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3">
                                <p className="text-sm text-slate-500">
                                    Created
                                </p>

                                <p className="text-sm text-slate-300 sm:col-span-2">
                                    {formatDate(workspace.created_at)}
                                </p>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3">
                                <p className="text-sm text-slate-500">
                                    Last updated
                                </p>

                                <p className="text-sm text-slate-300 sm:col-span-2">
                                    {formatDate(workspace.updated_at)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-800/80 bg-slate-900/40">
                        <div className="border-b border-slate-800/80 px-6 py-5">
                            <p className="font-mono text-xs uppercase tracking-widest text-indigo-400">
                                Owner
                            </p>

                            <h2 className="mt-1 text-lg font-semibold">
                                Workspace owner
                            </h2>
                        </div>

                        {owner ? (
                            <div className="p-6">
                                <div className="flex items-center gap-4">
                                    {owner.user.profile_picture ? (
                                        <img
                                            src={`${API_URL}${owner.user.profile_picture}`}
                                            alt={ownerName}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                            {ownerName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-100">
                                            {ownerName}
                                        </p>

                                        <p className="truncate text-sm text-slate-500">
                                            @{owner.user.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-600">
                                            Email
                                        </p>

                                        <p className="mt-1 break-all text-sm text-slate-300">
                                            {owner.user.email || "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-600">
                                            Phone
                                        </p>

                                        <p className="mt-1 text-sm text-slate-300">
                                            {owner.user.phone_number ||
                                                "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-600">
                                            Address
                                        </p>

                                        <p className="mt-1 text-sm text-slate-300">
                                            {owner.user.address || "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-600">
                                            Joined
                                        </p>

                                        <p className="mt-1 text-sm text-slate-300">
                                            {formatShortDate(
                                                owner.joined_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-sm text-slate-500">
                                No owner information available.
                            </div>
                        )}
                    </section>
                </div>

                <section className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/40">
                    <div className="flex flex-col gap-4 border-b border-slate-800/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-widest text-indigo-400">
                                Team
                            </p>

                            <h2 className="mt-1 text-lg font-semibold">
                                Members
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                router.push(
                                    `/workspaces/${workspace.id}/members/invite`
                                )
                            }
                            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                        >
                            Invite member
                        </button>
                    </div>

                    {workspace.members.length > 0 ? (
                        <div className="divide-y divide-slate-800/70">
                            {workspace.members.map((member) => {
                                const name = getFullName(
                                    member.user.first_name,
                                    member.user.last_name,
                                    member.user.username
                                );

                                return (
                                    <div
                                        key={member.id}
                                        className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex min-w-0 items-center gap-4">
                                            {member.user.profile_picture ? (
                                                <img
                                                    src={`${API_URL}${member.user.profile_picture}`}
                                                    alt={name}
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-300">
                                                    {name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-medium text-slate-200">
                                                        {name}
                                                    </p>

                                                    {member.user
                                                        .is_active && (
                                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                                        )}
                                                </div>

                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                    @{member.user.username}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 sm:justify-end">
                                            <div className="hidden text-right sm:block">
                                                <p className="text-xs text-slate-600">
                                                    Joined
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {formatShortDate(
                                                        member.joined_at
                                                    )}
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${member.role ===
                                                    "owner"
                                                    ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                                                    : member.role ===
                                                        "admin"
                                                        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                                        : "border-slate-700 bg-slate-800/50 text-slate-400"
                                                    }`}
                                            >
                                                {member.role}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <p className="text-sm text-slate-400">
                                No members found.
                            </p>
                        </div>
                    )}
                </section>

                <section className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/40">
                    <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-widest text-indigo-400">
                                Projects
                            </p>

                            <h2 className="mt-1 text-lg font-semibold">
                                Workspace projects
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Projects created inside this workspace.
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                router.push(
                                    `/workspaces/${workspace.id}/projects/new`
                                )
                            }
                            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                        >
                            Create project
                        </button>
                    </div>

                    {workspace.projects_count === 0 ? (
                        <div className="border-t border-slate-800/70 px-6 py-12 text-center">
                            <p className="text-sm font-medium text-slate-300">
                                No projects yet
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Create your first project to start organizing
                                work.
                            </p>
                        </div>
                    ) : (
                        <div className="border-t border-slate-800/70 px-6 py-8">
                            <p className="text-sm text-slate-400">
                                {workspace.projects_count} projects available
                                in this workspace.
                            </p>
                        </div>
                    )}
                </section>
            </main>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                            !
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-white">
                            Delete workspace?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            This action will permanently delete{" "}
                            <span className="font-medium text-slate-200">
                                {workspace.name}
                            </span>{" "}
                            and its associated data. This cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                                className="cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
                            >
                                Delete workspace
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}