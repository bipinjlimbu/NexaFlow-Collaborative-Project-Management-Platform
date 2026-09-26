"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { updateProject } from "@/services/projectService";
import type {
    Project,
    ProjectStatus,
    ProjectPriority,
} from "@/types/project";

interface EditProjectFormProps {
    project: Project;
    onClose: () => void;
    onUpdated: (project: Project) => void;
}

export default function EditProjectForm({
    project,
    onClose,
    onUpdated,
}: EditProjectFormProps) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(
        project.description || ""
    );
    const [startDate, setStartDate] = useState(
        project.start_date || ""
    );
    const [dueDate, setDueDate] = useState(
        project.due_date || ""
    );
    const [status, setStatus] = useState<ProjectStatus>(
        project.status
    );
    const [priority, setPriority] = useState<ProjectPriority>(
        project.priority
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [generalError, setGeneralError] = useState("");

    useEffect(() => {
        setName(project.name);
        setDescription(project.description || "");
        setStartDate(project.start_date || "");
        setDueDate(project.due_date || "");
        setStatus(project.status);
        setPriority(project.priority);
        setErrors({});
        setGeneralError("");
    }, [project]);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setErrors({});
        setGeneralError("");

        const validationErrors: Record<string, string> = {};

        if (!name.trim()) {
            validationErrors.name = "This field is required.";
        }

        if (!description.trim()) {
            validationErrors.description =
                "This field is required.";
        }

        if (
            startDate &&
            dueDate &&
            startDate > dueDate
        ) {
            validationErrors.due_date =
                "Due date cannot be before the start date.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSaving(true);

            const updatedProject = await updateProject(
                project.id,
                {
                    name: name.trim(),
                    description: description.trim(),
                    status,
                    priority,
                    start_date: startDate || null,
                    due_date: dueDate || null,
                }
            );

            onUpdated(updatedProject);
            onClose();
        } catch (err: any) {
            if (err && typeof err === "object") {
                const backendErrors: Record<string, string> = {};

                Object.entries(err).forEach(
                    ([field, message]) => {
                        if (typeof message === "string") {
                            backendErrors[field] = message;
                        } else if (Array.isArray(message)) {
                            backendErrors[field] =
                                message.join(" ");
                        }
                    }
                );

                if (Object.keys(backendErrors).length > 0) {
                    setErrors(backendErrors);
                } else if (typeof err.error === "string") {
                    setGeneralError(err.error);
                } else if (typeof err.detail === "string") {
                    setGeneralError(err.detail);
                } else {
                    setGeneralError(
                        "Unable to update project."
                    );
                }
            } else {
                setGeneralError(
                    "Unable to update project."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/85 p-3 sm:p-5 backdrop-blur-sm">
            <div className="relative flex max-h-[calc(100vh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] shadow-2xl shadow-black/40 sm:max-h-[calc(100vh-40px)]">
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-800 px-5 py-5 sm:px-7">
                    <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="h-1.5 w-8 rounded-full bg-indigo-500" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                Project settings
                            </span>
                        </div>

                        <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                            Edit project
                        </h2>

                        <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-400 sm:text-sm">
                            Update the project details, schedule,
                            status, and priority.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                        className="shrink-0 rounded-xl border border-slate-800 bg-[#111827] p-2 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto">
                    {generalError && (
                        <div className="mx-5 mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 sm:mx-7">
                            {generalError}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 px-5 py-5 sm:px-7 sm:py-6"
                    >
                        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-slate-100">
                                    Basic information
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Set the name and purpose of the project.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Project name
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="e.g. Website Redesign"
                                        className={`w-full rounded-xl border bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 ${errors.name
                                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                            : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                            }`}
                                    />

                                    {errors.name && (
                                        <p className="mt-1.5 text-xs text-rose-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Description
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(event) =>
                                            setDescription(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Describe project objectives and scope..."
                                        rows={5}
                                        className={`w-full resize-none rounded-xl border bg-[#020617] px-3.5 py-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 ${errors.description
                                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                            : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                            }`}
                                    />

                                    {errors.description && (
                                        <p className="mt-1.5 text-xs text-rose-400">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-slate-100">
                                    Project settings
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Control the current state and priority.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Status
                                    </label>

                                    <select
                                        value={status}
                                        onChange={(event) =>
                                            setStatus(
                                                event.target.value as ProjectStatus
                                            )
                                        }
                                        className={`w-full rounded-xl border bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition [color-scheme:dark] ${errors.status
                                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                            : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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

                                    {errors.status && (
                                        <p className="mt-1.5 text-xs text-rose-400">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Priority
                                    </label>

                                    <select
                                        value={priority}
                                        onChange={(event) =>
                                            setPriority(
                                                event.target.value as ProjectPriority
                                            )
                                        }
                                        className={`w-full rounded-xl border bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition [color-scheme:dark] ${errors.priority
                                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                            : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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

                                    {errors.priority && (
                                        <p className="mt-1.5 text-xs text-rose-400">
                                            {errors.priority}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-slate-100">
                                    Schedule
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Set optional project start and due dates.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Start date
                                    </label>

                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(event) =>
                                            setStartDate(event.target.value)
                                        }
                                        className={`w-full rounded-xl border bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition [color-scheme:dark] ${errors.start_date
                                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                            : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                            }`}
                                    />

                                    {errors.start_date && (
                                        <p className="mt-1.5 text-xs text-rose-400">
                                            {errors.start_date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Due date
                                    </label>

                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(event) =>
                                            setDueDate(event.target.value)
                                        }
                                        className={`w-full rounded-xl border bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition [color-scheme:dark] ${errors.due_date
                                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                            : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                            }`}
                                    />

                                    {errors.due_date && (
                                        <p className="mt-1.5 text-xs text-rose-400">
                                            {errors.due_date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
                                className="w-full rounded-xl border border-slate-800 bg-[#111827] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    "Save changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}