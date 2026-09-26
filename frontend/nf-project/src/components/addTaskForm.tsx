"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/85 p-3 backdrop-blur-sm sm:p-5">
            <div className="relative flex max-h-[calc(100vh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] shadow-2xl shadow-black/40 sm:max-h-[calc(100vh-40px)]">
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-800 px-5 py-5 sm:px-7">
                    <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="h-1.5 w-8 rounded-full bg-indigo-500" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                Project task
                            </span>
                        </div>

                        <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                            Add task
                        </h2>

                        <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                            Create a task, set its priority and assign it to a project member.
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
                                    Task information
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Give the task a clear title and description.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Task title
                                    </label>

                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                        placeholder="e.g. Design the login page"
                                        className={`w-full rounded-xl border bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 ${errors.title
                                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                            : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                            }`}
                                    />

                                    {errors.title && (
                                        <p className="mt-1.5 text-xs text-rose-400">
                                            {errors.title}
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
                                        placeholder="Describe what needs to be completed..."
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
                                    Task settings
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Choose the current status and priority.
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
                                                event.target.value as TaskStatus
                                            )
                                        }
                                        className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 [color-scheme:dark]"
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
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Priority
                                    </label>

                                    <select
                                        value={priority}
                                        onChange={(event) =>
                                            setPriority(
                                                event.target.value as TaskPriority
                                            )
                                        }
                                        className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 [color-scheme:dark]"
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
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-slate-100">
                                    Assignment
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Set the deadline and choose who will handle the task.
                                </p>
                            </div>

                            <div className="space-y-4">
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

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Assign to
                                    </label>

                                    <select
                                        value={assignedTo}
                                        onChange={(event) =>
                                            setAssignedTo(
                                                event.target.value
                                            )
                                        }
                                        className={`w-full cursor-pointer rounded-xl border bg-[#020617] px-3.5 py-3 text-sm text-slate-100 outline-none transition [color-scheme:dark] ${errors.assigned_to
                                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                            : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    "Create task"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}