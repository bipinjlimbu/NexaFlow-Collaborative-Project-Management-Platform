"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspacesSkeleton from "@/components/WorkspacesSkeleton";
import {
    ArrowRight,
    FolderKanban,
    MoreHorizontal,
    Plus,
    Search,
    Users,
} from "lucide-react";

const initialWorkspaces = [
    {
        name: "ApexStriker Core",
        description: "Main workspace for single-vendor B2C e-commerce platform and API.",
        members: 24,
        projects: 12,
        role: "Owner",
        initials: "AS",
    },
    {
        name: "Design Team",
        description: "Design, branding and product experience projects.",
        members: 8,
        projects: 5,
        role: "Member",
        initials: "DT",
    },
    {
        name: "Personal Projects",
        description: "Personal projects and experiments.",
        members: 1,
        projects: 4,
        role: "Owner",
        initials: "PP",
    },
];

const recentWorkspaces = [
    {
        name: "ApexStriker Core",
        initials: "AS",
        lastOpened: "10 minutes ago",
    },
    {
        name: "Design Team",
        initials: "DT",
        lastOpened: "Yesterday",
    },
];

export default function WorkspacesPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    if (!isAuthenticated) {
        return <WorkspacesSkeleton />;
    }

    const filteredWorkspaces = initialWorkspaces.filter(
        (ws) =>
            ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ws.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end pb-6 border-b border-slate-800/80">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-3">
                            ApexStriker Ecosystem
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Workspaces
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-slate-400">
                            Organize your projects, teams, and work in separate dedicated workspaces.
                        </p>
                    </div>

                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/20">
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

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Your workspaces</h2>
                            <p className="mt-0.5 text-sm text-slate-400">
                                Workspaces you currently belong to.
                            </p>
                        </div>
                        <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                            {filteredWorkspaces.length} workspaces
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredWorkspaces.map((workspace) => (
                            <div
                                key={workspace.name}
                                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-indigo-500/5"
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-sm font-semibold">
                                            {workspace.initials}
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
                                            {workspace.role === "Owner" && (
                                                <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                                                    Owner
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-slate-400">
                                            {workspace.description}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-3">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Users size={14} className="text-indigo-400" />
                                                <span className="text-xs">Members</span>
                                            </div>
                                            <p className="mt-1 text-lg font-semibold text-slate-100">
                                                {workspace.members}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-3">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <FolderKanban size={14} className="text-indigo-400" />
                                                <span className="text-xs">Projects</span>
                                            </div>
                                            <p className="mt-1 text-lg font-semibold text-slate-100">
                                                {workspace.projects}
                                            </p>
                                        </div>
                                    </div>

                                    <button className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-600 hover:text-white">
                                        Open workspace
                                        <ArrowRight
                                            size={15}
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button className="group flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-6 text-center transition-all duration-200 hover:border-indigo-500/50 hover:bg-slate-900/40">
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
                </section>

                <section className="mt-12">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-100">Recently opened</h2>
                        <p className="mt-0.5 text-sm text-slate-400">
                            Quickly return to your recent work.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm divide-y divide-slate-800/60">
                        {recentWorkspaces.map((workspace) => (
                            <button
                                key={workspace.name}
                                className="group flex w-full items-center gap-4 px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-800/40"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/50 text-xs font-semibold text-slate-200 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
                                    {workspace.initials}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                                        {workspace.name}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Opened {workspace.lastOpened}
                                    </p>
                                </div>

                                <ArrowRight
                                    size={16}
                                    className="text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-300"
                                />
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}