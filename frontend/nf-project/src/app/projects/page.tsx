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
        <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8 flex flex-col justify-between gap-6 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end">
                    <div>
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-400">
                            NexaFlow Ecosystem
                        </span>

                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Projects
                        </h1>

                        <p className="mt-2 max-w-xl text-sm text-slate-400">
                            Monitor progress, manage timelines,
                            and track deliverables across all
                            workspace teams.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreatePanel}
                        className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                        <Plus size={18} />
                        Create project
                    </button>
                </div>

                <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                    <div className="flex flex-1 items-center rounded-xl border border-slate-800 bg-slate-900/60 px-4 transition-colors focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50">
                        <Search
                            size={18}
                            className="text-slate-500"
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
                        className="h-11 cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 px-4 text-sm text-slate-100 outline-none transition-colors focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
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

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">
                                Your projects
                            </h2>

                            <p className="mt-0.5 text-sm text-slate-400">
                                Projects you are actively involved in.
                            </p>
                        </div>

                        <span className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
                            {filteredProjects.length} projects
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredProjects.map((project) => {
                            const StatusIcon =
                                statusConfig[
                                    project.status
                                ].icon;

                            return (
                                <div
                                    key={project.id}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-indigo-500/5"
                                >
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/20 text-sm font-semibold text-indigo-400">
                                                {project.initials}
                                            </div>

                                            <button
                                                type="button"
                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                                            >
                                                <MoreHorizontal
                                                    size={18}
                                                />
                                            </button>
                                        </div>

                                        <div className="mt-5">
                                            <div className="flex items-center gap-2.5">
                                                <h3 className="truncate font-semibold text-slate-100 group-hover:text-white">
                                                    {
                                                        project.name
                                                    }
                                                </h3>

                                                <span
                                                    className={`flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${statusConfig[project.status].bg} ${statusConfig[project.status].color}`}
                                                >
                                                    <StatusIcon
                                                        size={10}
                                                    />
                                                    {
                                                        project.status
                                                    }
                                                </span>
                                            </div>

                                            <p className="mt-2 min-h-[40px] line-clamp-2 text-sm leading-relaxed text-slate-400">
                                                {
                                                    project.description
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3">
                                                <div className="flex items-center justify-between text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Activity
                                                            size={14}
                                                            className="text-indigo-400"
                                                        />

                                                        <span className="text-xs">
                                                            Priority
                                                        </span>
                                                    </div>

                                                    <span className="text-xs font-semibold text-slate-300">
                                                        {
                                                            project.priority
                                                        }
                                                    </span>
                                                </div>

                                                <div className="mt-2 text-xs text-slate-500">
                                                    Project priority
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <LayoutList
                                                        size={14}
                                                        className="text-indigo-400"
                                                    />

                                                    <span className="text-xs">
                                                        Tasks
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-base font-semibold text-slate-100">
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
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    `/projects/${project.id}`
                                                )
                                            }
                                            className="mt-5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-600 hover:text-white"
                                        >
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

                        <button
                            type="button"
                            onClick={openCreatePanel}
                            className="group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-6 text-center transition-all duration-200 hover:border-indigo-500/50 hover:bg-slate-900/40"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-colors duration-200 group-hover:border-indigo-500/40 group-hover:bg-indigo-600/10 group-hover:text-indigo-400">
                                <Plus size={20} />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-200 group-hover:text-white">
                                Create a project
                            </h3>

                            <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-400">
                                Start a new project and invite
                                your team to collaborate.
                            </p>
                        </button>
                    </div>
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