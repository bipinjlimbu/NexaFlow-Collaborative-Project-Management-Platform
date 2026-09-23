"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-100">
                            Edit project
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Update your project details
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                </div>

                {generalError && (
                    <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
                        {generalError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                            Project name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            className={`w - full rounded - xl border bg - slate - 950 / 60 px - 4 py - 3 text - sm text - slate - 200 outline - none transition ${errors.name
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-slate-800 focus:border-indigo-500"
                                } `}
                        />

                        {errors.name && (
                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows={4}
                            className={`w - full resize - none rounded - xl border bg - slate - 950 / 60 px - 4 py - 3 text - sm text - slate - 200 outline - none transition ${errors.description
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-slate-800 focus:border-indigo-500"
                                } `}
                        />

                        {errors.description && (
                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Start date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(
                                        event.target.value
                                    )
                                }
                                className={`w - full rounded - xl border bg - slate - 950 / 60 px - 4 py - 3 text - sm text - slate - 200 outline - none transition ${errors.start_date
                                    ? "border-rose-500/50 focus:border-rose-500"
                                    : "border-slate-800 focus:border-indigo-500"
                                    } `}
                            />

                            {errors.start_date && (
                                <p className="mt-1.5 text-xs text-rose-400">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Due date
                            </label>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(event) =>
                                    setDueDate(
                                        event.target.value
                                    )
                                }
                                className={`w - full rounded - xl border bg - slate - 950 / 60 px - 4 py - 3 text - sm text - slate - 200 outline - none transition ${errors.due_date
                                    ? "border-rose-500/50 focus:border-rose-500"
                                    : "border-slate-800 focus:border-indigo-500"
                                    } `}
                            />

                            {errors.due_date && (
                                <p className="mt-1.5 text-xs text-rose-400">
                                    {errors.due_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}