"use client";

import { useState } from "react";
import { Calendar, X } from "lucide-react";
import { createProject } from "@/services/projectService";
import type {
    Project as ProjectData,
    ProjectPriority as BackendProjectPriority,
    ProjectStatus as BackendProjectStatus,
} from "@/types/project";
import type { Workspace } from "@/types/workspace";

interface ProjectErrors {
    name?: string;
    description?: string;
    workspace_id?: string;
    status?: string;
    priority?: string;
    start_date?: string;
    due_date?: string;
    detail?: string;
    error?: string;
}

interface AddProjectFormProps {
    workspaces: Workspace[];
    onClose: () => void;
    onCreated: (project: ProjectData) => void;
}

export default function AddProjectForm({
    workspaces,
    onClose,
    onCreated,
}: AddProjectFormProps) {
    const [creatingProject, setCreatingProject] = useState(false);
    const [projectErrors, setProjectErrors] =
        useState<ProjectErrors>({});

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] =
        useState("");
    const [projectWorkspace, setProjectWorkspace] = useState(
        workspaces.length > 0 ? String(workspaces[0].id) : ""
    );
    const [projectStatus, setProjectStatus] =
        useState<BackendProjectStatus>("active");
    const [projectPriority, setProjectPriority] =
        useState<BackendProjectPriority>("medium");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectDueDate, setProjectDueDate] = useState("");

    function resetProjectForm() {
        setProjectName("");
        setProjectDescription("");
        setProjectStatus("active");
        setProjectPriority("medium");
        setProjectStartDate("");
        setProjectDueDate("");
        setProjectErrors({});

        if (workspaces.length > 0) {
            setProjectWorkspace(String(workspaces[0].id));
        } else {
            setProjectWorkspace("");
        }
    }

    function closeForm() {
        if (creatingProject) {
            return;
        }

        resetProjectForm();
        onClose();
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

        const selectedWorkspace = workspaces.find(
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
                status: projectStatus,
                priority: projectPriority,
                start_date: projectStartDate,
                due_date: projectDueDate,
            });

            onCreated(createdProject);
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

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeForm}
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
                        onClick={closeForm}
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
                                {projectErrors.detail}
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
                                    clearFieldError("name");
                                }}
                                placeholder="Enter project name"
                                className={`h-11 w-full rounded-xl border bg-slate-900 px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 ${projectErrors.name
                                        ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                                        : "border-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                    }`}
                            />

                            {projectErrors.name && (
                                <p className="mt-2 text-xs text-red-400">
                                    {projectErrors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                Workspace
                            </label>

                            <select
                                value={projectWorkspace}
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
                                {workspaces.length === 0 ? (
                                    <option value="">
                                        No workspace available
                                    </option>
                                ) : (
                                    workspaces.map(
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
                                value={projectDescription}
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
                                    Status
                                </label>

                                <select
                                    value={projectStatus}
                                    onChange={(e) => {
                                        setProjectStatus(
                                            e.target
                                                .value as BackendProjectStatus
                                        );
                                        clearFieldError(
                                            "status"
                                        );
                                    }}
                                    className={`h-11 w-full cursor-pointer rounded-xl border bg-slate-900 px-4 text-sm text-slate-100 outline-none transition ${projectErrors.status
                                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                                            : "border-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                        }`}
                                >
                                    <option value="planning">
                                        Planning
                                    </option>
                                    <option value="active">
                                        Active
                                    </option>
                                    <option value="inactive">
                                        Inactive
                                    </option>
                                    <option value="archived">
                                        Archived
                                    </option>
                                </select>

                                {projectErrors.status && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {
                                            projectErrors.status
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Priority
                                </label>

                                <select
                                    value={projectPriority}
                                    onChange={(e) => {
                                        setProjectPriority(
                                            e.target
                                                .value as BackendProjectPriority
                                        );
                                        clearFieldError(
                                            "priority"
                                        );
                                    }}
                                    className={`h-11 w-full cursor-pointer rounded-xl border bg-slate-900 px-4 text-sm text-slate-100 outline-none transition ${projectErrors.priority
                                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                                            : "border-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                                        }`}
                                >
                                    <option value="low">
                                        Low
                                    </option>
                                    <option value="medium">
                                        Medium
                                    </option>
                                    <option value="high">
                                        High
                                    </option>
                                    <option value="urgent">
                                        Urgent
                                    </option>
                                </select>

                                {projectErrors.priority && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {
                                            projectErrors.priority
                                        }
                                    </p>
                                )}
                            </div>
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
                                                e.target.value
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
                                                e.target.value
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
                            onClick={closeForm}
                            disabled={creatingProject}
                            className="h-10 cursor-pointer rounded-xl border border-slate-800 bg-slate-900 px-5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={creatingProject}
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
    );
}