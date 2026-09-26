"use client";

import { useState } from "react";
import { Calendar, FolderKanban, X } from "lucide-react";
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

    function inputClasses(
        hasError: boolean,
        extra = ""
    ) {
        return `w-full border bg-[#0F172A] text-sm text-slate-100 outline-none transition placeholder:text-slate-600 ${hasError
            ? "border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
            : "border-slate-800 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            } ${extra}`;
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={closeForm}
            />

            <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-[#020617] shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-[#0F172A] px-5 py-5 sm:px-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                            <FolderKanban size={19} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-50">
                                Create Project
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Add a new project to your workspace.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={closeForm}
                        disabled={creatingProject}
                        aria-label="Close"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                </div>

                <form
                    onSubmit={handleCreateProject}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
                        <div className="space-y-6">
                            {(projectErrors.detail ||
                                projectErrors.error) && (
                                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
                                        <p className="text-sm leading-5 text-rose-400">
                                            {projectErrors.detail ||
                                                projectErrors.error}
                                        </p>
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
                                    className={`${inputClasses(
                                        !!projectErrors.name
                                    )} h-11 rounded-xl px-4`}
                                />

                                {projectErrors.name && (
                                    <p className="mt-2 text-xs text-rose-400">
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
                                    className={`${inputClasses(
                                        !!projectErrors.workspace_id
                                    )} h-11 cursor-pointer rounded-xl px-4`}
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
                                    <p className="mt-2 text-xs text-rose-400">
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
                                    className={`${inputClasses(
                                        !!projectErrors.description
                                    )} resize-none rounded-xl px-4 py-3 leading-6`}
                                />

                                {projectErrors.description && (
                                    <p className="mt-2 text-xs text-rose-400">
                                        {
                                            projectErrors.description
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="mb-3">
                                    <h3 className="text-sm font-medium text-slate-200">
                                        Project settings
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Set the current status and priority.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-slate-400">
                                            Status
                                        </label>

                                        <select
                                            value={
                                                projectStatus
                                            }
                                            onChange={(e) => {
                                                setProjectStatus(
                                                    e.target
                                                        .value as BackendProjectStatus
                                                );
                                                clearFieldError(
                                                    "status"
                                                );
                                            }}
                                            className={`${inputClasses(
                                                !!projectErrors.status
                                            )} h-11 cursor-pointer rounded-xl px-4`}
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
                                            <p className="mt-2 text-xs text-rose-400">
                                                {
                                                    projectErrors.status
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-slate-400">
                                            Priority
                                        </label>

                                        <select
                                            value={
                                                projectPriority
                                            }
                                            onChange={(e) => {
                                                setProjectPriority(
                                                    e.target
                                                        .value as BackendProjectPriority
                                                );
                                                clearFieldError(
                                                    "priority"
                                                );
                                            }}
                                            className={`${inputClasses(
                                                !!projectErrors.priority
                                            )} h-11 cursor-pointer rounded-xl px-4`}
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
                                            <p className="mt-2 text-xs text-rose-400">
                                                {
                                                    projectErrors.priority
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-3">
                                    <h3 className="text-sm font-medium text-slate-200">
                                        Timeline
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Choose when the project starts and ends.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-slate-400">
                                            Start date
                                        </label>

                                        <div className="relative">
                                            <Calendar
                                                size={16}
                                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
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
                                                className={`${inputClasses(
                                                    !!projectErrors.start_date
                                                )} h-11 rounded-xl pl-10 pr-3`}
                                            />
                                        </div>

                                        {projectErrors.start_date && (
                                            <p className="mt-2 text-xs text-rose-400">
                                                {
                                                    projectErrors.start_date
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-slate-400">
                                            Due date
                                        </label>

                                        <div className="relative">
                                            <Calendar
                                                size={16}
                                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
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
                                                className={`${inputClasses(
                                                    !!projectErrors.due_date
                                                )} h-11 rounded-xl pl-10 pr-3`}
                                            />
                                        </div>

                                        {projectErrors.due_date && (
                                            <p className="mt-2 text-xs text-rose-400">
                                                {
                                                    projectErrors.due_date
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-slate-800 bg-[#0F172A] px-5 py-4 sm:px-7">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={creatingProject}
                                className="h-11 w-full cursor-pointer rounded-xl border border-slate-800 bg-[#111827] px-5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={creatingProject}
                                className="h-11 w-full cursor-pointer rounded-xl bg-indigo-500 px-5 text-sm font-medium text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {creatingProject
                                    ? "Creating..."
                                    : "Create Project"}
                            </button>
                        </div>
                    </div>
                </form>
            </aside>
        </div>
    );
}