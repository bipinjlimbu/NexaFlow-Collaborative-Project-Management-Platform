"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    changeTaskPriority,
    changeTaskStatus,
    deleteTask,
    getTask,
} from "@/services/taskService";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";
import TaskDetailSkeleton from "@/components/TaskDetailSkeleton";
import TaskEditForm from "@/components/TaskEditForm";

export default function TaskDetailPage() {
    const params = useParams();
    const router = useRouter();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [changingPriority, setChangingPriority] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            router.push("/login");
            return;
        }

        const loadTask = async () => {
            try {
                const id = Number(params.id);

                if (Number.isNaN(id)) {
                    setError("Invalid task ID.");
                    return;
                }

                const data = await getTask(id);
                setTask(data);
            } catch (error) {
                setError("Task not found.");
            } finally {
                setLoading(false);
            }
        };

        loadTask();
    }, [params.id, router]);

    const handleChangeStatus = async (status: TaskStatus) => {
        if (!task || changingStatus) {
            return;
        }

        try {
            setChangingStatus(true);

            await changeTaskStatus(task.id, status);

            const updatedTask = await getTask(task.id);
            setTask(updatedTask);
            setShowStatusDropdown(false);
        } catch (error) {
            console.error(error);
            alert("Failed to change task status.");
        } finally {
            setChangingStatus(false);
        }
    };

    const handleChangePriority = async (priority: TaskPriority) => {
        if (!task || changingPriority) {
            return;
        }

        try {
            setChangingPriority(true);

            await changeTaskPriority(task.id, priority);

            const updatedTask = await getTask(task.id);
            setTask(updatedTask);
            setShowPriorityDropdown(false);
        } catch (error) {
            console.error(error);
            alert("Failed to change task priority.");
        } finally {
            setChangingPriority(false);
        }
    };

    const handleDelete = async () => {
        if (!task || deleting) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            await deleteTask(task.id);
            router.push("/tasks");
        } catch (error) {
            console.error(error);
            setDeleting(false);
            alert("Failed to delete task.");
        }
    };

    const handleEditSuccess = (updatedTask: Task) => {
        setTask(updatedTask);
        setEditing(false);
    };

    if (loading) {
        return <TaskDetailSkeleton />;
    }

    if (error || !task) {
        return (
            <main className="min-h-screen bg-slate-950 text-slate-50">
                <div className="mx-auto max-w-5xl px-6 py-10">
                    <Link
                        href="/tasks"
                        className="text-sm text-slate-400 transition hover:text-indigo-400"
                    >
                        ← Back to Tasks
                    </Link>

                    <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center">
                        <h1 className="text-lg font-semibold text-white">
                            Task not found
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            The requested task could not be found.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const assignee = task.assigned_to
        ? task.assigned_to.first_name || task.assigned_to.last_name
            ? `${task.assigned_to.first_name || ""} ${task.assigned_to.last_name || ""} `.trim()
            : task.assigned_to.username
        : "Unassigned";

    const createdBy =
        task.created_by.first_name || task.created_by.last_name
            ? `${task.created_by.first_name || ""} ${task.created_by.last_name || ""} `.trim()
            : task.created_by.username;

    const priorityLabel =
        task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    const statusLabel =
        task.status === "in_progress"
            ? "In Progress"
            : task.status === "review"
                ? "In Review"
                : task.status === "todo"
                    ? "To Do"
                    : task.status === "backlog"
                        ? "Backlog"
                        : "Done";

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

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <header className="mb-8">
                    <Link
                        href="/tasks"
                        className="text-xs font-medium text-slate-500 transition hover:text-indigo-400"
                    >
                        ← Back to Tasks
                    </Link>

                    <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400">
                                    Task
                                </span>

                                <span className="text-xs text-slate-700">
                                    /
                                </span>

                                <span className="font-mono text-[11px] text-slate-500">
                                    #{task.id}
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                {task.title}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                {task.description || "No description provided."}
                            </p>
                        </div>

                        <span
                            className={`inline - flex w - fit rounded - full border px - 3 py - 1.5 text - xs font - medium ${task.status === "done"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : task.status === "in_progress"
                                    ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                                    : task.status === "review"
                                        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                        : "border-slate-700 bg-slate-800/70 text-slate-400"
                                } `}
                        >
                            {statusLabel}
                        </span>
                    </div>
                </header>

                <section className="mb-6 rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowStatusDropdown(
                                        !showStatusDropdown
                                    );
                                    setShowPriorityDropdown(false);
                                }}
                                disabled={changingStatus}
                                className="w-full rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-400 transition hover:border-indigo-500/40 hover:bg-indigo-500/15 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {changingStatus
                                    ? "Changing..."
                                    : "Change Status"}
                            </button>

                            {showStatusDropdown && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                handleChangeStatus(
                                                    option.value
                                                )
                                            }
                                            disabled={
                                                changingStatus ||
                                                task.status === option.value
                                            }
                                            className={`block w - full px - 4 py - 3 text - left text - sm transition ${task.status === option.value
                                                ? "cursor-default bg-indigo-500/10 text-indigo-400"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                } disabled: opacity - 50`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative flex-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPriorityDropdown(
                                        !showPriorityDropdown
                                    );
                                    setShowStatusDropdown(false);
                                }}
                                disabled={changingPriority}
                                className="w-full rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-400 transition hover:border-amber-500/40 hover:bg-amber-500/15 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {changingPriority
                                    ? "Changing..."
                                    : "Change Priority"}
                            </button>

                            {showPriorityDropdown && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
                                    {priorityOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                handleChangePriority(
                                                    option.value
                                                )
                                            }
                                            disabled={
                                                changingPriority ||
                                                task.priority === option.value
                                            }
                                            className={`block w - full px - 4 py - 3 text - left text - sm transition ${task.priority === option.value
                                                ? "cursor-default bg-amber-500/10 text-amber-400"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                } disabled: opacity - 50`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="flex-1 rounded-lg border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm font-medium text-sky-400 transition hover:border-sky-500/40 hover:bg-sky-500/15 hover:text-sky-300"
                        >
                            Edit Task
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400 transition hover:border-rose-500/40 hover:bg-rose-500/15 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {deleting ? "Deleting..." : "Delete Task"}
                        </button>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-6 lg:col-span-2">
                        <div className="mb-6">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                Task Information
                            </span>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                    Project
                                </p>

                                <p className="mt-2 text-sm font-medium text-slate-200">
                                    {task.project.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                    Workspace
                                </p>

                                <p className="mt-2 text-sm font-medium text-slate-200">
                                    {task.project.workspace.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                    Priority
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <span
                                        className={`h - 2 w - 2 rounded - full ${task.priority === "urgent" ||
                                            task.priority === "high"
                                            ? "bg-rose-400"
                                            : task.priority === "medium"
                                                ? "bg-amber-400"
                                                : "bg-slate-500"
                                            } `}
                                    />

                                    <span
                                        className={`text - sm font - medium ${task.priority === "urgent" ||
                                            task.priority === "high"
                                            ? "text-rose-400"
                                            : task.priority === "medium"
                                                ? "text-amber-400"
                                                : "text-slate-400"
                                            } `}
                                    >
                                        {priorityLabel}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                    Due Date
                                </p>

                                <p className="mt-2 text-sm font-medium text-slate-200">
                                    {task.due_date
                                        ? new Date(
                                            task.due_date
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "2-digit",
                                            year: "numeric",
                                        })
                                        : "No due date"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                    Assigned To
                                </p>

                                <p className="mt-2 text-sm font-medium text-slate-200">
                                    {assignee}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                    Created By
                                </p>

                                <p className="mt-2 text-sm font-medium text-slate-200">
                                    {createdBy}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-6">
                        <div className="mb-6">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                Timeline
                            </span>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                                    Created
                                </p>

                                <p className="mt-2 text-xs text-slate-300">
                                    {new Date(
                                        task.created_at
                                    ).toLocaleString("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                                    Last Updated
                                </p>

                                <p className="mt-2 text-xs text-slate-300">
                                    {new Date(
                                        task.updated_at
                                    ).toLocaleString("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                                    Completed
                                </p>

                                <p className="mt-2 text-xs text-slate-300">
                                    {task.completed_at
                                        ? new Date(
                                            task.completed_at
                                        ).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })
                                        : "Not completed"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {editing && (
                <TaskEditForm
                    task={task}
                    onSuccess={handleEditSuccess}
                    onCancel={() => setEditing(false)}
                />
            )}
        </main>
    );
}