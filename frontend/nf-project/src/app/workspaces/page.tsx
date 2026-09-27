"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspacesSkeleton from "@/components/WorkspacesSkeleton";
import {
    createWorkspace,
    getWorkspaces,
} from "@/services/workspaceService";
import type { Workspace } from "@/types/workspace";
import {
    ArrowRight,
    FolderKanban,
    MoreHorizontal,
    Plus,
    Search,
    Users,
    X,
} from "lucide-react";

export default function WorkspacesPage() {
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceDescription, setWorkspaceDescription] = useState("");

    useEffect(() => {
        async function loadWorkspaces() {
            const token = localStorage.getItem("access");

            if (!token) {
                setIsAuthenticated(false);
                router.replace("/login");
                return;
            }

            setIsAuthenticated(true);

            try {
                const data = await getWorkspaces();
                setWorkspaces(data);
                setError("");
            } catch (err) {
                setError(
                    typeof err === "object" && err !== null && "message" in err
                        ? String(err.message)
                        : "Failed to load workspaces."
                );
            } finally {
                setLoading(false);
            }
        }

        loadWorkspaces();

        function handleAuthChange() {
            const token = localStorage.getItem("access");

            if (!token) {
                setIsAuthenticated(false);
                router.replace("/login");
            } else {
                setLoading(true);
                loadWorkspaces();
            }
        }

        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [router]);

    const handleCreateWorkspace = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!workspaceName.trim()) {
            setCreateError("Workspace name is required.");
            return;
        }

        setCreating(true);
        setCreateError("");

        try {
            const newWorkspace = await createWorkspace({
                name: workspaceName.trim(),
                description: workspaceDescription.trim(),
            });

            setWorkspaces((current) => [newWorkspace, ...current]);
            setWorkspaceName("");
            setWorkspaceDescription("");
            setShowCreateForm(false);
        } catch (err) {
            if (typeof err === "object" && err !== null) {
                if ("message" in err) {
                    setCreateError(String(err.message));
                } else if ("detail" in err) {
                    setCreateError(String(err.detail));
                } else {
                    setCreateError("Failed to create workspace.");
                }
            } else {
                setCreateError("Failed to create workspace.");
            }
        } finally {
            setCreating(false);
        }
    };

    const closeCreateForm = () => {
        if (creating) return;

        setShowCreateForm(false);
        setWorkspaceName("");
        setWorkspaceDescription("");
        setCreateError("");
    };

    if (isAuthenticated === null || loading) {
        return <WorkspacesSkeleton />;
    }

    if (!isAuthenticated) {
        return <WorkspacesSkeleton />;
    }

    const filteredWorkspaces = workspaces.filter(
        (workspace) =>
            workspace.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (workspace.description || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const getInitials = (name: string) => {
        const words = name.trim().split(/\s+/);

        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        }

        return words
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const openWorkspace = (id: number) => {
        router.push(`/workspaces/${id}`);
    };

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] shadow-2xl shadow-black/10">
                    <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-indigo-500/[0.06] blur-3xl" />

                    <div className="relative flex flex-col gap-7 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-8">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-400">
                                <Users size={13} />
                                Workspace Management
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                                Workspaces
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                                Organize your projects, teams, and work in dedicated
                                workspaces.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setCreateError("");
                                setShowCreateForm(true);
                            }}
                            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all duration-200 hover:bg-indigo-400 active:scale-[0.98] sm:w-auto"
                        >
                            <Plus size={17} />
                            Create Workspace
                        </button>
                    </div>
                </section>

                <section className="mt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-md lg:max-w-lg">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="text"
                                placeholder="Search workspaces..."
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                                className="h-11 w-full rounded-xl border border-slate-800 bg-[#0F172A] pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            {filteredWorkspaces.length}{" "}
                            {filteredWorkspaces.length === 1
                                ? "workspace"
                                : "workspaces"}
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                        {error}
                    </div>
                )}

                <section className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
                            Your Workspaces
                        </h2>

                        <p className="mt-1.5 text-sm text-slate-500">
                            Workspaces you currently belong to.
                        </p>
                    </div>

                    {filteredWorkspaces.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/60 px-6 py-16 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-500">
                                {searchQuery ? (
                                    <Search size={20} />
                                ) : (
                                    <FolderKanban size={20} />
                                )}
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-200">
                                {searchQuery
                                    ? "No workspaces found"
                                    : "No workspaces yet"}
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                                {searchQuery
                                    ? "Try adjusting your search."
                                    : "Create your first workspace to start organizing your work."}
                            </p>

                            {!searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCreateError("");
                                        setShowCreateForm(true);
                                    }}
                                    className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
                                >
                                    <Plus size={16} />
                                    Create Workspace
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredWorkspaces.map((workspace) => (
                                <div
                                    key={workspace.id}
                                    className="group relative flex min-h-[330px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-[#151d2d]"
                                >
                                    <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/[0.035] blur-2xl" />

                                    <div className="relative">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                                {getInitials(workspace.name)}
                                            </div>

                                            <button
                                                type="button"
                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>

                                        <div className="mt-5">
                                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                <h3 className="max-w-full truncate font-semibold text-slate-100 group-hover:text-white">
                                                    {workspace.name}
                                                </h3>

                                                {workspace.role === "owner" && (
                                                    <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
                                                        Owner
                                                    </span>
                                                )}

                                                {workspace.role === "admin" && (
                                                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 min-h-[40px] text-sm leading-5 text-slate-400">
                                                {workspace.description ||
                                                    "No description provided."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Users
                                                        size={14}
                                                        className="text-indigo-400"
                                                    />
                                                    <span className="text-xs">
                                                        Members
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-lg font-semibold text-slate-100">
                                                    {workspace.members_count}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <FolderKanban
                                                        size={14}
                                                        className="text-indigo-400"
                                                    />
                                                    <span className="text-xs">
                                                        Projects
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-lg font-semibold text-slate-100">
                                                    {workspace.projects_count}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openWorkspace(workspace.id)
                                            }
                                            className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-indigo-500/40 hover:bg-indigo-500 hover:text-white"
                                        >
                                            Open Workspace
                                            <ArrowRight
                                                size={15}
                                                className="transition-transform duration-200 group-hover:translate-x-1"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    setCreateError("");
                                    setShowCreateForm(true);
                                }}
                                className="group flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/60 p-6 text-center transition-all duration-200 hover:border-indigo-500/40 hover:bg-[#111827]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-500 transition-colors duration-200 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                                    <Plus size={20} />
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-200 group-hover:text-white">
                                    Create a Workspace
                                </h3>

                                <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-500">
                                    Start a new workspace for a team, project,
                                    or organization.
                                </p>
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {showCreateForm && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
                        onClick={closeCreateForm}
                    />

                    <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-800 bg-[#020617] shadow-2xl shadow-black/50">
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-5 sm:px-6">
                                <div>
                                    <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                        <Plus size={13} />
                                        New Workspace
                                    </div>

                                    <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                                        Create Workspace
                                    </h2>

                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        Create a new workspace for your team or
                                        project.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeCreateForm}
                                    disabled={creating}
                                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-slate-800 hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form
                                onSubmit={handleCreateWorkspace}
                                className="flex flex-1 flex-col"
                            >
                                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
                                    {createError && (
                                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-5 text-rose-400">
                                            {createError}
                                        </div>
                                    )}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Workspace Name
                                        </label>

                                        <input
                                            type="text"
                                            value={workspaceName}
                                            onChange={(e) =>
                                                setWorkspaceName(e.target.value)
                                            }
                                            placeholder="e.g. ApexStriker Core"
                                            disabled={creating}
                                            autoFocus
                                            className="h-11 w-full rounded-xl border border-slate-800 bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Description
                                        </label>

                                        <textarea
                                            value={workspaceDescription}
                                            onChange={(e) =>
                                                setWorkspaceDescription(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Describe what this workspace is used for..."
                                            disabled={creating}
                                            rows={5}
                                            className="w-full resize-none rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm leading-relaxed text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                                    <button
                                        type="button"
                                        onClick={closeCreateForm}
                                        disabled={creating}
                                        className="h-10 w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            creating || !workspaceName.trim()
                                        }
                                        className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >
                                        {creating ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={16} />
                                                Create Workspace
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}