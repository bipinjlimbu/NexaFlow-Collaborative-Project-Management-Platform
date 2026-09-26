"use client";

import { FormEvent, useEffect, useState } from "react";
import type {
    EditTaskData,
    Task,
    TaskPriority,
    TaskStatus,
} from "@/types/task";
import { editTask } from "@/services/taskService";

interface TaskEditFormProps {
    task: Task;
    onSuccess: (task: Task) => void;
    onCancel: () => void;
}

const statusOptions: {
    value: TaskStatus;
    label: string;
}[] = [
        { value: "backlog", label: "Backlog" },
        { value: "todo", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "review", label: "In Review" },
        { value: "done", label: "Done" },
    ];

const priorityOptions: {
    value: TaskPriority;
    label: string;
}[] = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
    ];

export default function TaskEditForm({
    task,
    onSuccess,
    onCancel,
}: TaskEditFormProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(task.status);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);
    const [dueDate, setDueDate] = useState(
        task.due_date ? task.due_date.split("T")[0] : ""
    );
    const [assignedTo, setAssignedTo] = useState(
        task.assigned_to ? String(task.assigned_to.id) : ""
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description || "");
        setTaskStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
        setAssignedTo(
            task.assigned_to ? String(task.assigned_to.id) : ""
        );
        setErrors({});
    }, [task]);

    const getMemberUser = (member: any) => {
        return member.user || member;
    };

    const getUserName = (member: any) => {
        const user = getMemberUser(member);

        if (user.first_name || user.last_name) {
            return `${user.first_name || ""} ${user.last_name || ""}`.trim();
        }

        return user.username || user.email || `User #${user.id}`;
    };

    const getUserId = (member: any) => {
        const user = getMemberUser(member);
        return user.id;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrors({});

        const data: EditTaskData = {
            title,
            description,
            status: taskStatus,
            priority,
            due_date: dueDate,
            assigned_to: Number(assignedTo),
        };

        try {
            setSubmitting(true);

            const updatedTask = await editTask(task.id, data);

            onSuccess(updatedTask);
        } catch (error: unknown) {
            console.error(error);

            if (
                typeof error === "object" &&
                error !== null &&
                "errors" in error
            ) {
                const apiError = error as {
                    errors?: Record<string, string>;
                };

                if (apiError.errors) {
                    setErrors(apiError.errors);
                    return;
                }
            }

            setErrors({
                general: "Failed to update task.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-5 backdrop-blur-sm sm:py-8">
            <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-2xl shadow-black/40">
                <div className="flex items-start justify-between gap-5 border-b border-slate-800 px-5 py-5 sm:px-7">
                    <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-400">
                                Task
                            </span>

                            <span className="font-mono text-[11px] text-slate-600">
                                #{task.id}
                            </span>
                        </div>

                        <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                            Edit Task
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Update the details, status, priority, or assignee.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        aria-label="Close"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] text-lg text-slate-500 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto px-5 py-6 sm:px-7"
                >
                    {errors.general && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-400">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-xs">
                                !
                            </span>
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                className={`w-full rounded-xl border bg-[#0F172A] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 ${errors.title
                                    ? "border-rose-500/50 focus:border-rose-400"
                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                                    }`}
                                placeholder="Enter task title"
                            />

                            {errors.title && (
                                <p className="mt-2 text-xs text-rose-400">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                rows={5}
                                className={`w-full resize-none rounded-xl border bg-[#0F172A] px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 ${errors.description
                                    ? "border-rose-500/50 focus:border-rose-400"
                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                                    }`}
                                placeholder="Describe what needs to be done"
                            />

                            {errors.description && (
                                <p className="mt-2 text-xs text-rose-400">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Status
                                </label>

                                <select
                                    value={taskStatus}
                                    onChange={(event) =>
                                        setTaskStatus(
                                            event.target.value as TaskStatus
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                                >
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Priority
                                </label>

                                <select
                                    value={priority}
                                    onChange={(event) =>
                                        setPriority(
                                            event.target.value as TaskPriority
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-800 bg-[#0F172A] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                                >
                                    {priorityOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) =>
                                        setDueDate(event.target.value)
                                    }
                                    className={`w-full rounded-xl border bg-[#0F172A] px-4 py-3 text-sm text-slate-200 outline-none transition ${errors.due_date
                                        ? "border-rose-500/50 focus:border-rose-400"
                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                                        }`}
                                />

                                {errors.due_date && (
                                    <p className="mt-2 text-xs text-rose-400">
                                        {errors.due_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Assigned To
                                </label>

                                <select
                                    value={assignedTo}
                                    onChange={(event) =>
                                        setAssignedTo(event.target.value)
                                    }
                                    className={`w-full rounded-xl border bg-[#0F172A] px-4 py-3 text-sm text-slate-200 outline-none transition ${errors.assigned_to
                                        ? "border-rose-500/50 focus:border-rose-400"
                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                                        }`}
                                >
                                    <option value="">Select member</option>

                                    {task.project.members.map((member) => {
                                        const userId = getUserId(member);

                                        return (
                                            <option
                                                key={userId}
                                                value={userId}
                                            >
                                                {getUserName(member)}
                                            </option>
                                        );
                                    })}
                                </select>

                                {errors.assigned_to && (
                                    <p className="mt-2 text-xs text-rose-400">
                                        {errors.assigned_to}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="rounded-xl border border-slate-800 bg-[#0F172A] px-5 py-3 text-sm font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}