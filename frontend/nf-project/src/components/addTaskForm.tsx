"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createTask } from "@/services/taskService";
import type {
    Task,
    TaskPriority,
    TaskStatus,
} from "@/types/task";
import type { ProjectMember } from "@/types/project";

interface AddTaskFormProps {
    projectId: number;
    projectMembers: ProjectMember[];
    onClose: () => void;
    onCreated: (task: Task) => void;
}

export default function AddTaskForm({
    projectId,
    projectMembers,
    onClose,
    onCreated,
}: AddTaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] =
        useState<TaskStatus>("backlog");
    const [priority, setPriority] =
        useState<TaskPriority>("medium");
    const [dueDate, setDueDate] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    const [errors, setErrors] = useState<
        Record<string, string>
    >({});
    const [generalError, setGeneralError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setTitle("");
        setDescription("");
        setStatus("backlog");
        setPriority("medium");
        setDueDate("");
        setAssignedTo("");
        setErrors({});
        setGeneralError("");
    }, [projectId]);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setErrors({});
        setGeneralError("");

        const validationErrors: Record<string, string> = {};

        if (!title.trim()) {
            validationErrors.title =
                "This field is required.";
        }

        if (!description.trim()) {
            validationErrors.description =
                "This field is required.";
        }

        if (!dueDate) {
            validationErrors.due_date =
                "This field is required.";
        }

        if (!assignedTo) {
            validationErrors.assigned_to =
                "This field is required.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSaving(true);

            const task = await createTask({
                title: title.trim(),
                description: description.trim(),
                status,
                priority,
                project: projectId,
                due_date: dueDate,
                assigned_to: Number(assignedTo),
            });

            onCreated(task);
            onClose();
        } catch (err: any) {
            if (
                err &&
                typeof err === "object" &&
                err.errors &&
                typeof err.errors === "object"
            ) {
                const backendErrors: Record<
                    string,
                    string
                > = {};

                Object.entries(err.errors).forEach(
                    ([field, message]) => {
                        if (typeof message === "string") {
                            backendErrors[field] = message;
                        } else if (Array.isArray(message)) {
                            backendErrors[field] =
                                message.join(" ");
                        }
                    }
                );

                if (
                    Object.keys(backendErrors).length > 0
                ) {
                    setErrors(backendErrors);
                } else {
                    setGeneralError(
                        "Unable to create task."
                    );
                }
            } else if (
                err &&
                typeof err === "object" &&
                typeof err.error === "string"
            ) {
                setGeneralError(err.error);
            } else if (
                err &&
                typeof err === "object" &&
                typeof err.detail === "string"
            ) {
                setGeneralError(err.detail);
            } else {
                setGeneralError(
                    "Unable to create task."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-100">
                            Add task
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create a new task for this project
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
                            Task title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            className={`w-full rounded-xl border bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition ${errors.title
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-slate-800 focus:border-indigo-500"
                                }`}
                        />

                        {errors.title && (
                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.title}
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
                            className={`w-full resize-none rounded-xl border bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition ${errors.description
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-slate-800 focus:border-indigo-500"
                                }`}
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
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value as TaskStatus
                                    )
                                }
                                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500"
                            >
                                <option value="backlog">
                                    Backlog
                                </option>
                                <option value="todo">
                                    To Do
                                </option>
                                <option value="in_progress">
                                    In Progress
                                </option>
                                <option value="review">
                                    Review
                                </option>
                                <option value="done">
                                    Done
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Priority
                            </label>

                            <select
                                value={priority}
                                onChange={(event) =>
                                    setPriority(
                                        event.target.value as TaskPriority
                                    )
                                }
                                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500"
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
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                            Due date
                        </label>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(event) =>
                                setDueDate(event.target.value)
                            }
                            className={`w-full rounded-xl border bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition ${errors.due_date
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-slate-800 focus:border-indigo-500"
                                }`}
                        />

                        {errors.due_date && (
                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.due_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                            Assign to
                        </label>

                        <select
                            value={assignedTo}
                            onChange={(event) =>
                                setAssignedTo(
                                    event.target.value
                                )
                            }
                            className={`w-full cursor-pointer rounded-xl border bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition ${errors.assigned_to
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-slate-800 focus:border-indigo-500"
                                }`}
                        >
                            <option value="">
                                Select a project member
                            </option>

                            {projectMembers.map((member) => (
                                <option
                                    key={member.id}
                                    value={member.user.id}
                                >
                                    {member.user.first_name ||
                                        member.user.last_name
                                        ? `${member.user.first_name} ${member.user.last_name}`.trim()
                                        : member.user.username}
                                </option>
                            ))}
                        </select>

                        {errors.assigned_to && (
                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.assigned_to}
                            </p>
                        )}
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
                                ? "Creating..."
                                : "Create task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}