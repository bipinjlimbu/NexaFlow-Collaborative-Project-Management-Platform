"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import WorkspacesSkeleton from "@/components/WorkspacesSkeleton";
import {
    getWorkspace,
    type Workspace,
} from "@/services/workspaceService";
import {
    ArrowLeft,
    CalendarDays,
    FolderKanban,
    Mail,
    MapPin,
    MoreHorizontal,
    Pencil,
    Phone,
    ShieldCheck,
    Users,
} from "lucide-react";

interface WorkspaceUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    profile_picture: string | null;
    is_active: boolean;
}

interface WorkspaceDetailMember {
    id: number;
    joined_at: string;
    role: "owner" | "admin" | "member";
    user: WorkspaceUser;
    workspace: number;
}

interface WorkspaceDetail extends Omit<Workspace, "members"> {
    members: WorkspaceDetailMember[];
}

export default function WorkspaceDetailPage() {
    const router = useRouter();
    const params = useParams();

    const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

    const workspaceId = Number(params.id);

    useEffect(() => {
        async function loadWorkspace() {
            const token = localStorage.getItem("access");

            if (!token) {
                setIsAuthenticated(false);
                router.replace("/login");
                return;
            }

            setIsAuthenticated(true);

            if (!workspaceId || Number.isNaN(workspaceId)) {
                setError("Invalid workspace.");
                setLoading(false);
                return;
            }

            try {
                const data = await getWorkspace(workspaceId);
                setWorkspace(data as WorkspaceDetail);
                setError("");
            } catch (err) {
                if (
                    typeof err === "object" &&
                    err !== null &&
                    "detail" in err
                ) {
                    setError(String(err.detail));
                } else if (
                    typeof err === "object" &&
                    err !== null &&
                    "message" in err
                ) {
                    setError(String(err.message));
                } else {
                    setError("Failed to load workspace.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadWorkspace();

        function handleAuthChange() {
            const token = localStorage.getItem("access");

            if (!token) {
                setIsAuthenticated(false);
                router.replace("/login");
            }
        }

        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [router, workspaceId]);

    if (isAuthenticated === null || loading) {
        return <WorkspacesSkeleton />;
    }

    if (!isAuthenticated) {
        return <WorkspacesSkeleton />;
    }

    if (error || !workspace) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
                        <FolderKanban size={24} />
                    </div>

                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-red-400">
                        Workspace Error
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        Unable to load workspace
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-slate-500">
                        {error || "The workspace could not be found."}
                    </p>

                    <button
                        onClick={() => router.push("/workspaces")}
                        className="mt-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        <ArrowLeft size={15} />
                        Back to workspaces
                    </button>
                </div>
            </main>
        );
    }

    const owner =
        workspace.members.find((member) => member.role === "owner") ||
        workspace.members[0];

    const ownerUser = owner?.user;

    const fullName = ownerUser
        ? [ownerUser.first_name, ownerUser.last_name]
            .filter(Boolean)
            .join(" ") || ownerUser.username
        : "Unknown user";

    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const profileImage = ownerUser?.profile_picture
        ? `${API_URL}${ownerUser.profile_picture} `
        : "";

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(date));
    };

    const formatDateTime = (date: string) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(new Date(date));
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8">
                    <Link
                        href="/workspaces"
                        className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition hover:text-slate-200"
                    >
                        <ArrowLeft size={15} />
                        Back to workspaces
                    </Link>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="h-32 bg-gradient-to-r from-indigo-500/20 via-slate-900 to-sky-500/10" />

                    <div className="px-6 pb-6 lg:px-8">
                        <div className="-mt-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex items-end gap-4">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-slate-950 bg-indigo-600/20 text-xl font-semibold text-indigo-400 shadow-xl">
                                    {workspace.name
                                        .trim()
                                        .split(/\s+/)
                                        .slice(0, 2)
                                        .map((word) => word[0])
                                        .join("")
                                        .toUpperCase()}
                                </div>

                                <div className="pb-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                            {workspace.name}
                                        </h1>

                                        {workspace.is_archived ? (
                                            <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                                                Archived
                                            </span>
                                        ) : (
                                            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                                                Active
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                                        {workspace.description ||
                                            "No description provided."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                                >
                                    <MoreHorizontal size={16} />
                                    More
                                </button>

                                <button
                                    className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500"
                                >
                                    <Pencil size={15} />
                                    Edit workspace
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 lg:col-span-2">
                        <div className="border-b border-slate-800/80 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                        Workspace
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold text-slate-100">
                                        Overview
                                    </h2>
                                </div>

                                <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-400">
                                    ID #{workspace.id}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-px bg-slate-800/60 sm:grid-cols-2">
                            <div className="bg-slate-900/60 p-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Users size={15} className="text-indigo-400" />
                                    <span className="text-xs uppercase tracking-wider">
                                        Members
                                    </span>
                                </div>

                                <p className="mt-3 text-2xl font-semibold text-white">
                                    {workspace.members_count}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Current workspace members
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <FolderKanban
                                        size={15}
                                        className="text-indigo-400"
                                    />
                                    <span className="text-xs uppercase tracking-wider">
                                        Projects
                                    </span>
                                </div>

                                <p className="mt-3 text-2xl font-semibold text-white">
                                    {workspace.projects_count}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Projects in this workspace
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <CalendarDays
                                        size={15}
                                        className="text-indigo-400"
                                    />
                                    <span className="text-xs uppercase tracking-wider">
                                        Created
                                    </span>
                                </div>

                                <p className="mt-3 text-sm font-medium text-slate-200">
                                    {formatDate(workspace.created_at)}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {formatDateTime(workspace.created_at)}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <CalendarDays
                                        size={15}
                                        className="text-indigo-400"
                                    />
                                    <span className="text-xs uppercase tracking-wider">
                                        Last Updated
                                    </span>
                                </div>

                                <p className="mt-3 text-sm font-medium text-slate-200">
                                    {formatDate(workspace.updated_at)}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {formatDateTime(workspace.updated_at)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40">
                        <div className="border-b border-slate-800/80 px-6 py-5">
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                Workspace Owner
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-slate-100">
                                Owner
                            </h2>
                        </div>

                        {ownerUser ? (
                            <div className="p-6">
                                <div className="flex items-center gap-4">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={fullName}
                                            className="h-14 w-14 rounded-xl border border-slate-800 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                            {initials}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {fullName}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            @{ownerUser.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Mail
                                            size={15}
                                            className="mt-0.5 shrink-0 text-slate-500"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                                Email
                                            </p>

                                            <p className="mt-1 break-all text-xs text-slate-300">
                                                {ownerUser.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone
                                            size={15}
                                            className="mt-0.5 shrink-0 text-slate-500"
                                        />

                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                                Phone
                                            </p>

                                            <p className="mt-1 text-xs text-slate-300">
                                                {ownerUser.phone_number ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin
                                            size={15}
                                            className="mt-0.5 shrink-0 text-slate-500"
                                        />

                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                                Address
                                            </p>

                                            <p className="mt-1 text-xs text-slate-300">
                                                {ownerUser.address ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CalendarDays
                                            size={15}
                                            className="mt-0.5 shrink-0 text-slate-500"
                                        />

                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                                Joined Workspace
                                            </p>

                                            <p className="mt-1 text-xs text-slate-300">
                                                {formatDate(owner.joined_at)}
                                            </p>
                                        </div>
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

                <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 px-6 py-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                Team
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-slate-100">
                                Members
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                People who currently belong to this workspace.
                            </p>
                        </div>

                        <button className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs font-medium text-slate-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400">
                            <Users size={14} />
                            Invite member
                        </button>
                    </div>

                    <div className="divide-y divide-slate-800/70">
                        {workspace.members.map((member) => {
                            const memberName =
                                [member.user.first_name, member.user.last_name]
                                    .filter(Boolean)
                                    .join(" ") || member.user.username;

                            const memberInitials = memberName
                                .split(" ")
                                .filter(Boolean)
                                .map((name) => name[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();

                            const memberImage = member.user.profile_picture
                                ? `${API_URL}${member.user.profile_picture} `
                                : "";

                            return (
                                <div
                                    key={member.id}
                                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        {memberImage ? (
                                            <img
                                                src={memberImage}
                                                alt={memberName}
                                                className="h-11 w-11 rounded-xl border border-slate-800 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                                                {memberInitials}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-medium text-slate-200">
                                                    {memberName}
                                                </p>

                                                <span
                                                    className={`rounded - md border px - 2 py - 0.5 text - [10px] font - medium ${member.role === "owner"
                                                            ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                                                            : member.role ===
                                                                "admin"
                                                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                                                : "border-slate-700 bg-slate-800/60 text-slate-400"
                                                        } `}
                                                >
                                                    {member.role
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        member.role.slice(1)}
                                                </span>

                                                {member.role === "owner" && (
                                                    <ShieldCheck
                                                        size={14}
                                                        className="text-indigo-400"
                                                    />
                                                )}
                                            </div>

                                            <p className="mt-1 truncate text-xs text-slate-500">
                                                @{member.user.username} ·{" "}
                                                {member.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 sm:shrink-0">
                                        <div className="text-left sm:text-right">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                                Joined
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {formatDate(member.joined_at)}
                                            </p>
                                        </div>

                                        <span
                                            className={`h - 2 w - 2 rounded - full ${member.user.is_active
                                                    ? "bg-emerald-400"
                                                    : "bg-slate-600"
                                                } `}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-5">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                Projects
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-slate-100">
                                Workspace Projects
                            </h2>
                        </div>

                        <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-400">
                            {workspace.projects_count} projects
                        </span>
                    </div>

                    {workspace.projects_count === 0 ? (
                        <div className="px-6 py-14 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-500">
                                <FolderKanban size={20} />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-200">
                                No projects yet
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                                Create a project inside this workspace to start
                                organizing your work.
                            </p>

                            <button className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500">
                                <FolderKanban size={15} />
                                Create project
                            </button>
                        </div>
                    ) : (
                        <div className="p-6">
                            <p className="text-sm text-slate-400">
                                {workspace.projects_count} projects belong to
                                this workspace.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}