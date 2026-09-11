"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspacesSkeleton from "@/components/WorkspacesSkeleton";
import { getWorkspaces, type Workspace } from "@/services/workspaceService";
import {
    ArrowRight,
    FolderKanban,
    MoreHorizontal,
    Plus,
    Search,
    Users,
} from "lucide-react";

export default function WorkspacesPage() {
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8 flex flex-col justify-between gap-6 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end">
                    <div>
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-400">
                            ApexStriker Ecosystem
                        </span>

                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Workspaces
                        </h1>

                        <p className="mt-2 max-w-xl text-sm text-slate-400">
                            Organize your projects, teams, and work in separate dedicated workspaces.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/workspaces/new")}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/20"
                    >
                        <Plus size={18} />
                        Create workspace
                    </button>
                </div>

                <div className="mb-8 flex items-center rounded-xl border border-slate-800 bg-slate-900/60 px-4 transition-colors focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50">
                    <Search size={18} className="text-slate-500" />

                    <input
                        type="text"
                        placeholder="Search workspaces..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 w-full bg-transparent px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                </div>

                {error && (
                    <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">
                                Your workspaces
                            </h2>

                            <p className="mt-0.5 text-sm text-slate-400">
                                Workspaces you currently belong to.
                            </p>
                        </div>

                        <span className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
                            {filteredWorkspaces.length} workspaces
                        </span>
                    </div>

                    {filteredWorkspaces.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 px-6 py-16 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-500">
                                <FolderKanban size={20} />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-200">
                                {searchQuery
                                    ? "No workspaces found"
                                    : "No workspaces yet"}
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-400">
                                {searchQuery
                                    ? "Try adjusting your search."
                                    : "Create your first workspace to start organizing your work."}
                            </p>

                            {!searchQuery && (
                                <button
                                    onClick={() => router.push("/workspaces/new")}
                                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500"
                                >
                                    <Plus size={16} />
                                    Create workspace
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filteredWorkspaces.map((workspace) => (
                                <div
                                    key={workspace.id}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-indigo-500/5"
                                >
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/20 text-sm font-semibold text-indigo-400">
                                                {getInitials(workspace.name)}
                                            </div>

                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-200">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>

                                        <div className="mt-5">
                                            <div className="flex items-center gap-2.5">
                                                <h3 className="font-semibold text-slate-100 group-hover:text-white">
                                                    {workspace.name}
                                                </h3>

                                                {workspace.role === "owner" && (
                                                    <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                                                        Owner
                                                    </span>
                                                )}

                                                {workspace.role === "admin" && (
                                                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-slate-400">
                                                {workspace.description ||
                                                    "No description provided."}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3">
                                                <div className="flex items-center gap-2 text-slate-400">
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

                                            <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3">
                                                <div className="flex items-center gap-2 text-slate-400">
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
                                            onClick={() =>
                                                openWorkspace(workspace.id)
                                            }
                                            className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-600 hover:text-white"
                                        >
                                            Open workspace
                                            <ArrowRight
                                                size={15}
                                                className="transition-transform duration-200 group-hover:translate-x-1"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => router.push("/workspaces/new")}
                                className="group flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-6 text-center transition-all duration-200 hover:border-indigo-500/50 hover:bg-slate-900/40"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-colors duration-200 group-hover:border-indigo-500/40 group-hover:bg-indigo-600/10 group-hover:text-indigo-400">
                                    <Plus size={20} />
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-200 group-hover:text-white">
                                    Create a workspace
                                </h3>

                                <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-400">
                                    Start a new workspace for a team, project, or organization.
                                </p>
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}