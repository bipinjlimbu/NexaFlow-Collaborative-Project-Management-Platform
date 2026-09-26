"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectsSkeleton from "@/components/ProjectsSkeleton";
import AddProjectForm from "@/components/AddProjectForm";
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
import { getProjects } from "@/services/projectService";
import { getWorkspaces } from "@/services/workspaceService";
import type {
    Project as ProjectData,
    ProjectPriority as BackendProjectPriority,
    ProjectStatus as BackendProjectStatus,
} from "@/types/project";
import type { Workspace } from "@/types/workspace";

type ProjectStatus =
    | "Active"
    | "Completed"
    | "In Review"
    | "Planning";

type ProjectPriority = "High" | "Medium" | "Low";

interface Project {
    id: number;
    name: string;
    description: string;
    workspace: string;
    workspaceId: number;
    status: ProjectStatus;
    priority: ProjectPriority;
    progress: number;
    completedTasks: number;
    totalTasks: number;
    members: number;
    dueDate: string;
    initials: string;
}

const statusConfig: Record<
    ProjectStatus,
    { color: string; bg: string; icon: any }
> = {
    Active: {
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20",
        icon: Activity,
    },
    Completed: {
        color: "text-sky-400",
        bg: "bg-sky-500/10 border-sky-500/20",
        icon: CheckCircle2,
    },
    "In Review": {
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
        icon: Clock,
    },
    Planning: {
        color: "text-slate-400",
        bg: "bg-slate-500/10 border-slate-500/20",
        icon: Calendar,
    },
};

function mapBackendStatus(
    status: BackendProjectStatus
): ProjectStatus {
    switch (status) {
        case "active":
            return "Active";
        case "inactive":
            return "In Review";
        case "archived":
            return "Completed";
        default:
            return "Planning";
    }
}

function mapBackendPriority(
    priority: BackendProjectPriority
): ProjectPriority {
    switch (priority) {
        case "high":
        case "urgent":
            return "High";
        case "low":
            return "Low";
        default:
            return "Medium";
    }
}

function formatDueDate(date: string | null) {
    if (!date) {
        return "Not set";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }
    );
}

function getProjectInitials(name: string) {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase() || "PR"
    );
}

export default function ProjectsPage() {
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] =
        useState<boolean | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [projects, setProjects] = useState<Project[]>([]);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [showCreatePanel, setShowCreatePanel] =
        useState(false);

    const availableWorkspaces = useMemo(() => {
        return workspaces;
    }, [workspaces]);

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
            window.removeEventListener(
                "auth-change",
                checkAuth
            );
        };
    }, [router]);

    useEffect(() => {
        async function loadData() {
            try {
                setLoadingProjects(true);

                const [workspaceData, projectData] =
                    await Promise.all([
                        getWorkspaces(),
                        getProjects(),
                    ]);

                setWorkspaces(workspaceData);

                const mappedProjects: Project[] =
                    projectData.map((project) => {
                        const workspace =
                            workspaceData.find(
                                (item) =>
                                    item.id ===
                                    project.workspace.id
                            );

                        return {
                            id: project.id,
                            name: project.name,
                            description:
                                project.description || "",
                            workspace:
                                workspace?.name ||
                                project.workspace.name ||
                                "Unknown workspace",
                            workspaceId:
                                project.workspace.id,
                            status: mapBackendStatus(
                                project.status
                            ),
                            priority: mapBackendPriority(
                                project.priority
                            ),
                            progress: 0,
                            completedTasks:
                                project.completed_tasks_count,
                            totalTasks:
                                project.tasks_count,
                            members:
                                project.members_count,
                            dueDate: formatDueDate(
                                project.due_date
                            ),
                            initials: getProjectInitials(
                                project.name
                            ),
                        };
                    });

                setProjects(mappedProjects);
            } catch {
                setWorkspaces([]);
                setProjects([]);
            } finally {
                setLoadingProjects(false);
            }
        }

        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                project.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                project.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, searchQuery, statusFilter]);

    function openCreatePanel() {
        setShowCreatePanel(true);
    }

    function handleProjectCreated(
        createdProject: ProjectData
    ) {
        const newProject: Project = {
            id: createdProject.id,
            name: createdProject.name,
            description: createdProject.description || "",
            workspace: createdProject.workspace.name,
            workspaceId: createdProject.workspace.id,
            status: mapBackendStatus(
                createdProject.status
            ),
            priority: mapBackendPriority(
                createdProject.priority
            ),
            progress: 0,
            completedTasks:
                createdProject.completed_tasks_count,
            totalTasks: createdProject.tasks_count,
            members: createdProject.members_count,
            dueDate: formatDueDate(
                createdProject.due_date
            ),
            initials: getProjectInitials(
                createdProject.name
            ),
        };

        setProjects((previous) => [
            newProject,
            ...previous,
        ]);

        setShowCreatePanel(false);

        router.push(
            `/projects/${createdProject.id}`
        );
    }

    if (!isAuthenticated || loadingProjects) {
        return <ProjectsSkeleton />;
    }

    return (
        <main className="min-h-screen bg-[#020617] text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] px-5 py-6 sm:px-7 sm:py-8 lg:px-8">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                                <LayoutList size={13} />
                                Project workspace
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                                Projects
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                                Manage projects, monitor progress,
                                and keep your workspace work organized.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openCreatePanel}
                            className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-medium text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <Plus size={18} />
                            Create Project
                        </button>
                    </div>
                </section>

                <section className="mt-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex min-h-11 flex-1 items-center rounded-xl border border-slate-800 bg-[#0F172A] px-4 transition focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
                            <Search
                                size={18}
                                className="shrink-0 text-slate-500"
                            />

                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(
                                        e.target.value
                                    )
                                }
                                className="h-11 w-full bg-transparent px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="h-11 cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] px-4 text-sm text-slate-200 outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                        >
                            <option value="All">
                                All Statuses
                            </option>
                            <option value="Active">
                                Active
                            </option>
                            <option value="Planning">
                                Planning
                            </option>
                            <option value="In Review">
                                In Review
                            </option>
                            <option value="Completed">
                                Completed
                            </option>
                        </select>
                    </div>
                </section>

                <section className="mt-8">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">
                                Your Projects
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Projects you are actively involved in.
                            </p>
                        </div>

                        <span className="w-fit rounded-lg border border-slate-800 bg-[#0F172A] px-3 py-1.5 text-xs font-medium text-slate-400">
                            {filteredProjects.length} projects
                        </span>
                    </div>

                    {filteredProjects.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/50 px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-[#111827] text-slate-500">
                                <Search size={22} />
                            </div>

                            <h3 className="mt-5 text-base font-semibold text-slate-200">
                                No projects found
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Try a different search or status filter,
                                or create a new project.
                            </p>

                            <button
                                type="button"
                                onClick={openCreatePanel}
                                className="mt-6 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-medium text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <Plus size={16} />
                                Create Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filteredProjects.map((project) => {
                                const StatusIcon =
                                    statusConfig[
                                        project.status
                                    ].icon;

                                return (
                                    <div
                                        key={project.id}
                                        className="group flex min-h-[320px] flex-col justify-between rounded-2xl border border-slate-800 bg-[#111827] p-5 transition duration-200 hover:border-slate-700 hover:bg-[#151d2d]"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                                                    {project.initials}
                                                </div>

                                                <button
                                                    type="button"
                                                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
                                                >
                                                    <MoreHorizontal
                                                        size={18}
                                                    />
                                                </button>
                                            </div>

                                            <div className="mt-5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-slate-100 group-hover:text-white">
                                                        {
                                                            project.name
                                                        }
                                                    </h3>

                                                    <span
                                                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusConfig[project.status].bg} ${statusConfig[project.status].color}`}
                                                    >
                                                        <StatusIcon
                                                            size={10}
                                                        />
                                                        {
                                                            project.status
                                                        }
                                                    </span>
                                                </div>

                                                <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-400">
                                                    {
                                                        project.description
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Activity
                                                            size={14}
                                                            className="text-indigo-400"
                                                        />

                                                        <span className="text-xs text-slate-400">
                                                            Priority
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-slate-200">
                                                        {
                                                            project.priority
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-slate-500">
                                                        Project priority
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-3">
                                                    <div className="flex items-center gap-2">
                                                        <LayoutList
                                                            size={14}
                                                            className="text-indigo-400"
                                                        />

                                                        <span className="text-xs text-slate-400">
                                                            Tasks
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-slate-100">
                                                        {
                                                            project.completedTasks
                                                        }{" "}
                                                        <span className="text-xs font-medium text-slate-500">
                                                            /
                                                            {
                                                                project.totalTasks
                                                            }
                                                        </span>
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-slate-500">
                                                        Completed
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/projects/${project.id}`
                                                    )
                                                }
                                                className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#0F172A] text-sm font-medium text-slate-300 transition hover:border-indigo-500/40 hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                            >
                                                Open Project
                                                <ArrowRight
                                                    size={15}
                                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                type="button"
                                onClick={openCreatePanel}
                                className="group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/40 p-6 text-center transition duration-200 hover:border-indigo-500/40 hover:bg-[#0F172A]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#111827] text-slate-500 transition group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                                    <Plus size={20} />
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-200 group-hover:text-white">
                                    Create a Project
                                </h3>

                                <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-500">
                                    Start a new project and bring your
                                    team together.
                                </p>
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {showCreatePanel && (
                <AddProjectForm
                    workspaces={availableWorkspaces}
                    onClose={() =>
                        setShowCreatePanel(false)
                    }
                    onCreated={handleProjectCreated}
                />
            )}
        </main>
    );
}