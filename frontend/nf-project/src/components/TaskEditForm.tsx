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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
                <div className="border-b border-slate-800 px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Edit Task
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Update the task information below.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {errors.general && (
                        <div className="mb-5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                            {errors.general}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                className={`w-full rounded-lg border bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 ${errors.title
                                    ? "border-rose-500/50"
                                    : "border-slate-800"
                                    }`}
                                placeholder="Task title"
                            />

                            {errors.title && (
                                <p className="mt-1.5 text-xs text-rose-400">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                rows={4}
                                className={`w-full resize-none rounded-lg border bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 ${errors.description
                                    ? "border-rose-500/50"
                                    : "border-slate-800"
                                    }`}
                                placeholder="Task description"
                            />

                            {errors.description && (
                                <p className="mt-1.5 text-xs text-rose-400">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                                    Status
                                </label>

                                <select
                                    value={taskStatus}
                                    onChange={(event) =>
                                        setTaskStatus(
                                            event.target.value as TaskStatus
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500/50"
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
                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                                    Priority
                                </label>

                                <select
                                    value={priority}
                                    onChange={(event) =>
                                        setPriority(
                                            event.target.value as TaskPriority
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500/50"
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
                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) =>
                                        setDueDate(event.target.value)
                                    }
                                    className={`w-full rounded-lg border bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500/50 ${errors.due_date
                                        ? "border-rose-500/50"
                                        : "border-slate-800"
                                        }`}
                                />

                                {errors.due_date && (
                                    <p className="mt-1.5 text-xs text-rose-400">
                                        {errors.due_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                                    Assigned To
                                </label>

                                <select
                                    value={assignedTo}
                                    onChange={(event) =>
                                        setAssignedTo(event.target.value)
                                    }
                                    className={`w-full rounded-lg border bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-500/50 ${errors.assigned_to
                                        ? "border-rose-500/50"
                                        : "border-slate-800"
                                        }`}
                                >
                                    <option value="">
                                        Select member
                                    </option>

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
                                    <p className="mt-1.5 text-xs text-rose-400">
                                        {errors.assigned_to}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="rounded-lg border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:bg-slate-900 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-400 transition hover:border-indigo-500/50 hover:bg-indigo-500/15 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}