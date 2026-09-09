"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Activity,
    ArrowRight,
    Calendar,
    CheckCircle2,
    Clock,
    LayoutList,
    MoreHorizontal,
    Plus,
    Search,
} from "lucide-react";
import { ProjectsSkeleton } from "./ProjectsSkeleton";

type ProjectStatus = "Active" | "Completed" | "In Review" | "Planning";
type ProjectPriority = "High" | "Medium" | "Low";

interface Project {
    id: number;
    name: string;
    description: string;
    workspace: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    progress: number;
    completedTasks: number;
    totalTasks: number;
    members: number;
    dueDate: string;
    initials: string;
}

const projects: Project[] = [
    {
        id: 1,
        name: "E-Commerce Core API",
        description: "Core backend services for products, orders, payments, vendors, and customer management.",
        workspace: "ApexStriker Core",
        status: "Completed",
        priority: "High",
        progress: 100,
        completedTasks: 15,
        totalTasks: 15,
        members: 4,
        dueDate: "Sep 05, 2026",
        initials: "EC",
    },
    {
        id: 2,
        name: "Mobile App Redesign",
        description: "Redesigning the mobile experience with a cleaner navigation system and improved UX.",
        workspace: "Design Team",
        status: "In Review",
        priority: "Medium",
        progress: 85,
        completedTasks: 8,
        totalTasks: 10,
        members: 5,
        dueDate: "Oct 04, 2026",
        initials: "MA",
    },
    {
        id: 3,
        name: "Analytics Dashboard",
        description: "Internal analytics system for tracking performance, activity, and operational metrics.",
        workspace: "ApexStriker Core",
        status: "Active",
        priority: "High",
        progress: 52,
        completedTasks: 11,
        totalTasks: 21,
        members: 7,
        dueDate: "Sep 28, 2026",
        initials: "AD",
    },
    {
        id: 4,
        name: "Marketing Website",
        description: "Company marketing website covering services, case studies, team, and contact information.",
        workspace: "Design Team",
        status: "Planning",
        priority: "Medium",
        progress: 8,
        completedTasks: 1,
        totalTasks: 12,
        members: 3,
        dueDate: "Oct 18, 2026",
        initials: "MW",
    },
];

const statusConfig: Record<ProjectStatus, { color: string; bg: string; icon: any }> = {
    Active: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: Activity },
    Completed: { color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", icon: CheckCircle2 },
    "In Review": { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Clock },
    Planning: { color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20", icon: Calendar },
};

export default function ProjectsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };
        checkAuth();
    }, [router]);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "All" || project.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const recentProjects = projects.slice(0, 2);

    if (isLoading) {
        return <ProjectsSkeleton />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">

                <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end pb-6 border-b border-slate-800/80">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-3">
                            ApexStriker Ecosystem
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Projects
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-slate-400">
                            Monitor progress, manage timelines, and track deliverables across all workspace teams.
                        </p>
                    </div>

                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/20">
                        <Plus size={18} />
                        Create project
                    </button>
                </div>

                <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                    <div className="flex flex-1 items-center rounded-xl border border-slate-800 bg-slate-900/60 px-4 transition-colors focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50">
                        <Search size={18} className="text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 w-full bg-transparent px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-11 rounded-xl border border-slate-800 bg-slate-900/60 px-4 text-sm text-slate-100 outline-none transition-colors focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Planning">Planning</option>
                        <option value="In Review">In Review</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Your projects</h2>
                            <p className="mt-0.5 text-sm text-slate-400">
                                Projects you are actively involved in.
                            </p>
                        </div>
                        <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                            {filteredProjects.length} projects
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredProjects.map((project) => {
                            const StatusIcon = statusConfig[project.status].icon;

                            return (
                                <div
                                    key={project.id}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-indigo-500/5"
                                >
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-sm font-semibold">
                                                {project.initials}
                                            </div>

                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-200">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>

                                        <div className="mt-5">
                                            <div className="flex items-center gap-2.5">
                                                <h3 className="font-semibold text-slate-100 group-hover:text-white truncate">
                                                    {project.name}
                                                </h3>
                                                <span className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${statusConfig[project.status].bg} ${statusConfig[project.status].color}`}>
                                                    <StatusIcon size={10} />
                                                    {project.status}
                                                </span>
                                            </div>

                                            <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-slate-400 line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-3">
                                                <div className="flex items-center justify-between text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Activity size={14} className="text-indigo-400" />
                                                        <span className="text-xs">Progress</span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-300">{project.progress}%</span>
                                                </div>
                                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                                    <div
                                                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-3">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <LayoutList size={14} className="text-indigo-400" />
                                                    <span className="text-xs">Tasks</span>
                                                </div>
                                                <p className="mt-1 text-base font-semibold text-slate-100">
                                                    {project.completedTasks} <span className="text-xs text-slate-500 font-medium">/ {project.totalTasks}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <button className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-600 hover:text-white">
                                            Open project
                                            <ArrowRight
                                                size={15}
                                                className="transition-transform duration-200 group-hover:translate-x-1"
                                            />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <button className="group flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-6 text-center transition-all duration-200 hover:border-indigo-500/50 hover:bg-slate-900/40">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-colors duration-200 group-hover:border-indigo-500/40 group-hover:bg-indigo-600/10 group-hover:text-indigo-400">
                                <Plus size={20} />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-slate-200 group-hover:text-white">
                                Create a project
                            </h3>
                            <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-400">
                                Start a new project and invite your team to collaborate.
                            </p>
                        </button>
                    </div>
                </section>

                <section className="mt-12">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-100">Recently active</h2>
                        <p className="mt-0.5 text-sm text-slate-400">
                            Quickly return to your recent project work.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm divide-y divide-slate-800/60">
                        {recentProjects.map((project) => (
                            <button
                                key={project.id}
                                className="group flex w-full items-center gap-4 px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-800/40"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/50 text-xs font-semibold text-slate-200 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
                                    {project.initials}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                                        {project.name}
                                    </p>
                                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                                        <span>Due {project.dueDate}</span>
                                        <span className="text-slate-600">•</span>
                                        <span className="text-slate-500">{project.workspace}</span>
                                    </div>
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