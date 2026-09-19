"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectsSkeleton from "@/components/ProjectsSkeleton";
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
    X,
} from "lucide-react";
import {
    createProject,
    getProjects,
    Project as ProjectData,
} from "@/services/projectService";
import {
    getWorkspaces,
    Workspace,
} from "@/services/workspaceService";

type ProjectStatus = "Active" | "Completed" | "In Review" | "Planning";
type ProjectPriority = "High" | "Medium" | "Low";

type BackendProject = ProjectData & {
    status: "planning" | "active" | "inactive" | "archived";
    priority: "low" | "medium" | "high" | "urgent";
    created_by: number;
};

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

interface ProjectErrors {
    name?: string;
    description?: string;
    workspace_id?: string;
    start_date?: string;
    due_date?: string;
    detail?: string;
    error?: string;
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
    status: BackendProject["status"]
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
    priority: BackendProject["priority"]
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

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [projects, setProjects] = useState<Project[]>([]);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);

    const [showCreatePanel, setShowCreatePanel] = useState(false);
    const [creatingProject, setCreatingProject] = useState(false);
    const [projectErrors, setProjectErrors] =
        useState<ProjectErrors>({});

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectWorkspace, setProjectWorkspace] = useState("");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectDueDate, setProjectDueDate] = useState("");

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
            window.removeEventListener("auth-change", checkAuth);
        };
    }, [router]);

    useEffect(() => {
        async function loadData() {
            try {
                setLoadingProjects(true);

                const [workspaceData, projectData] = await Promise.all([
                    getWorkspaces(),
                    getProjects(),
                ]);

                setWorkspaces(workspaceData);

                const mappedProjects: Project[] = projectData.map((project) => {
                    const workspace = workspaceData.find(
                        (item) => item.id === project.workspace.id
                    );

                    return {
                        id: project.id,
                        name: project.name,
                        description: project.description || "",
                        workspace:
                            workspace?.name ||
                            project.workspace.name ||
                            "Unknown workspace",
                        workspaceId: project.workspace.id,
                        status: mapBackendStatus(project.status),
                        priority: mapBackendPriority(project.priority),
                        progress: 0,
                        completedTasks: 0,
                        totalTasks: project.tasks_count,
                        members: project.members_count,
                        dueDate: formatDueDate(project.due_date),
                        initials: getProjectInitials(project.name),
                    };
                });
                setProjects(mappedProjects);

                if (workspaceData.length > 0) {
                    setProjectWorkspace(
                        String(workspaceData[0].id)
                    );
                }
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

    function resetProjectForm() {
        setProjectName("");
        setProjectDescription("");
        setProjectStartDate("");
        setProjectDueDate("");
        setProjectErrors({});

        if (availableWorkspaces.length > 0) {
            setProjectWorkspace(
                String(availableWorkspaces[0].id)
            );
        } else {
            setProjectWorkspace("");
        }
    }

    function openCreatePanel() {
        setProjectErrors({});

        if (
            !projectWorkspace &&
            availableWorkspaces.length > 0
        ) {
            setProjectWorkspace(
                String(availableWorkspaces[0].id)
            );
        }

        setShowCreatePanel(true);
    }

    function closeCreatePanel() {
        if (creatingProject) {
            return;
        }

        setShowCreatePanel(false);
        resetProjectForm();
    }

    function clearFieldError(
        field: keyof ProjectErrors
    ) {
        setProjectErrors((previous) => {
            const updated = { ...previous };
            delete updated[field];
            delete updated.detail;
            delete updated.error;
            return updated;
        });
    }

    async function handleCreateProject(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setProjectErrors({});

        const selectedWorkspace = availableWorkspaces.find(
            (workspace) =>
                workspace.id === Number(projectWorkspace)
        );

        if (!selectedWorkspace) {
            setProjectErrors({
                workspace_id: "Please select a workspace.",
            });
            return;
        }

        if (!projectName.trim()) {
            setProjectErrors({
                name: "This field is required.",
            });
            return;
        }

        if (!projectDescription.trim()) {
            setProjectErrors({
                description: "This field is required.",
            });
            return;
        }

        if (!projectStartDate) {
            setProjectErrors({
                start_date: "This field is required.",
            });
            return;
        }

        if (!projectDueDate) {
            setProjectErrors({
                due_date: "This field is required.",
            });
            return;
        }

        if (projectDueDate < projectStartDate) {
            setProjectErrors({
                due_date:
                    "Due date cannot be before the start date.",
            });
            return;
        }

        try {
            setCreatingProject(true);
            setProjectErrors({});

            const createdProject = await createProject({
                name: projectName.trim(),
                description: projectDescription.trim(),
                workspace_id: selectedWorkspace.id,
                start_date: projectStartDate,
                due_date: projectDueDate,
            });

            const newProject: Project = {
                id: createdProject.id,
                name: createdProject.name,
                description: createdProject.description || "",
                workspace: createdProject.workspace.name,
                workspaceId: createdProject.workspace.id,
                status: mapBackendStatus(createdProject.status),
                priority: mapBackendPriority(createdProject.priority),
                progress: 0,
                completedTasks: 0,
                totalTasks: createdProject.tasks_count,
                members: createdProject.members_count,
                dueDate: formatDueDate(createdProject.due_date),
                initials: getProjectInitials(createdProject.name),
            };

            setProjects((previous) => [
                newProject,
                ...previous,
            ]);

            setShowCreatePanel(false);
            resetProjectForm();

            router.push(`/projects/${createdProject.id}`);
        } catch (err: any) {
            if (err && typeof err === "object") {
                const normalizedErrors: ProjectErrors = {};

                Object.entries(err).forEach(
                    ([key, value]) => {
                        if (Array.isArray(value)) {
                            normalizedErrors[
                                key as keyof ProjectErrors
                            ] = value.join(" ");
                        } else if (
                            typeof value === "string"
                        ) {
                            normalizedErrors[
                                key as keyof ProjectErrors
                            ] = value;
                        }
                    }
                );

                if (
                    Object.keys(normalizedErrors).length > 0
                ) {
                    setProjectErrors(normalizedErrors);
                } else {
                    setProjectErrors({
                        detail:
                            "Unable to create project.",
                    });
                }
            } else {
                setProjectErrors({
                    detail:
                        "Unable to create project.",
                });
            }
        } finally {
            setCreatingProject(false);
        }
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
                            ApexStriker Ecosystem
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
                                setSearchQuery(e.target.value)
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
                                                    {project.name}
                                                </h3>

                                                <span
                                                    className={`flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${statusConfig[project.status].bg} ${statusConfig[project.status].color}`}
                                                >
                                                    <StatusIcon
                                                        size={10}
                                                    />
                                                    {project.status}
                                                </span>
                                            </div>

                                            <p className="mt-2 min-h-[40px] line-clamp-2 text-sm leading-relaxed text-slate-400">
                                                {project.description}
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
                                                        /{" "}
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
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeCreatePanel}
                    />

                    <div className="relative flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-950 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    Create project
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Create a new project inside
                                    a workspace.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeCreatePanel}
                                disabled={creatingProject}
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleCreateProject}
                            className="flex flex-1 flex-col overflow-y-auto"
                        >
                            <div className="flex-1 space-y-6 px-6 py-6">
                                {projectErrors.detail && (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {
                                            projectErrors.detail
                                        }
                                    </div>
                                )}

                                {projectErrors.error && (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {projectErrors.error}
                                    </div>
                                )}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Project name
                                    </label>

                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => {
                                            setProjectName(
                                                e.target.value
                                            );
                                            clearFieldError(
                                                "name"
                                            );
                                        }}
                                        placeholder="Enter project name"
                                        className={`h-11 w-full rounded-xl border bg-slate-900 px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 ${projectErrors.name
                                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                                            : "border-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                            }`}
                                    />

                                    {projectErrors.name && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {
                                                projectErrors.name
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Workspace
                                    </label>

                                    <select
                                        value={
                                            projectWorkspace
                                        }
                                        onChange={(e) => {
                                            setProjectWorkspace(
                                                e.target.value
                                            );
                                            clearFieldError(
                                                "workspace_id"
                                            );
                                        }}
                                        className={`h-11 w-full cursor-pointer rounded-xl border bg-slate-900 px-4 text-sm text-slate-100 outline-none transition ${projectErrors.workspace_id
                                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                                            : "border-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                            }`}
                                    >
                                        {availableWorkspaces.length ===
                                            0 ? (
                                            <option value="">
                                                No workspace available
                                            </option>
                                        ) : (
                                            availableWorkspaces.map(
                                                (workspace) => (
                                                    <option
                                                        key={
                                                            workspace.id
                                                        }
                                                        value={
                                                            workspace.id
                                                        }
                                                    >
                                                        {
                                                            workspace.name
                                                        }
                                                    </option>
                                                )
                                            )
                                        )}
                                    </select>

                                    {projectErrors.workspace_id && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {
                                                projectErrors.workspace_id
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            projectDescription
                                        }
                                        onChange={(e) => {
                                            setProjectDescription(
                                                e.target.value
                                            );
                                            clearFieldError(
                                                "description"
                                            );
                                        }}
                                        placeholder="Describe what this project is about..."
                                        rows={5}
                                        className={`w-full resize-none rounded-xl border bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 ${projectErrors.description
                                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                                            : "border-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                            }`}
                                    />

                                    {projectErrors.description && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {
                                                projectErrors.description
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Start date
                                        </label>

                                        <div className="relative">
                                            <Calendar
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                            />

                                            <input
                                                type="date"
                                                value={
                                                    projectStartDate
                                                }
                                                onChange={(e) => {
                                                    setProjectStartDate(
                                                        e.target
                                                            .value
                                                    );
                                                    clearFieldError(
                                                        "start_date"
                                                    );
                                                }}
                                                className={`h-11 w-full rounded-xl border bg-slate-900 pl-10 pr-3 text-sm text-slate-100 outline-none transition ${projectErrors.start_date
                                                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                                                    : "border-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                                    }`}
                                            />
                                        </div>

                                        {projectErrors.start_date && (
                                            <p className="mt-2 text-xs text-red-400">
                                                {
                                                    projectErrors.start_date
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Due date
                                        </label>

                                        <div className="relative">
                                            <Calendar
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                            />

                                            <input
                                                type="date"
                                                value={
                                                    projectDueDate
                                                }
                                                min={
                                                    projectStartDate ||
                                                    undefined
                                                }
                                                onChange={(e) => {
                                                    setProjectDueDate(
                                                        e.target
                                                            .value
                                                    );
                                                    clearFieldError(
                                                        "due_date"
                                                    );
                                                }}
                                                className={`h-11 w-full rounded-xl border bg-slate-900 pl-10 pr-3 text-sm text-slate-100 outline-none transition ${projectErrors.due_date
                                                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                                                    : "border-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                                    }`}
                                            />
                                        </div>

                                        {projectErrors.due_date && (
                                            <p className="mt-2 text-xs text-red-400">
                                                {
                                                    projectErrors.due_date
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-5">
                                <button
                                    type="button"
                                    onClick={closeCreatePanel}
                                    disabled={
                                        creatingProject
                                    }
                                    className="h-10 cursor-pointer rounded-xl border border-slate-800 bg-slate-900 px-5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        creatingProject
                                    }
                                    className="h-10 cursor-pointer rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {creatingProject
                                        ? "Creating..."
                                        : "Create project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}                                                   