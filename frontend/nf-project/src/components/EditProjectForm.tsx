"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { updateProject } from "@/services/projectService";
import type { Project } from "@/types/project";

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

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [generalError, setGeneralError] = useState("");

    useEffect(() => {
        setName(project.name);
        setDescription(project.description || "");
        setStartDate(project.start_date || "");
        setDueDate(project.due_date || "");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md transition-all">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/95 p-6 shadow-2xl shadow-indigo-950/20 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-800/60 pb-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-100">
                            Edit project
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Update your project preferences and schedule details.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* General Error Banner */}
                {generalError && (
                    <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400">
                        {generalError}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-4"
                >
                    {/* Project Name */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-300">
                            Project name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="e.g. Website Redesign"
                            className={`w-full rounded-xl border bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${errors.name
                                ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                                : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-700"
                                }`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-rose-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-300">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Describe project objectives and scope..."
                            rows={4}
                            className={`w-full resize-none rounded-xl border bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${errors.description
                                ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                                : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-700"
                                }`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-rose-400">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Start Date */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-300">
                                Start date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(event.target.value)
                                }
                                className={`w-full rounded-xl border bg-slate-950/60 px-3.5 py-2 text-sm text-slate-100 transition-all focus:outline-none focus:ring-2 [color-scheme:dark] ${errors.start_date
                                    ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                                    : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-700"
                                    }`}
                            />
                            {errors.start_date && (
                                <p className="mt-1 text-xs text-rose-400">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-300">
                                Due date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(event) =>
                                    setDueDate(event.target.value)
                                }
                                className={`w-full rounded-xl border bg-slate-950/60 px-3.5 py-2 text-sm text-slate-100 transition-all focus:outline-none focus:ring-2 [color-scheme:dark] ${errors.due_date
                                    ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                                    : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-700"
                                    }`}
                            />
                            {errors.due_date && (
                                <p className="mt-1 text-xs text-rose-400">
                                    {errors.due_date}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
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
    );
}