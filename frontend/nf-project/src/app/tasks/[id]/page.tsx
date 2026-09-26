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
            <main className="min-h-screen bg-[#020617] px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <Link
                        href="/tasks"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-indigo-400"
                    >
                        <span>←</span>
                        Back to Tasks
                    </Link>

                    <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]">
                        <div className="px-6 py-16 text-center sm:px-10">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-sm font-semibold text-rose-400">
                                !
                            </div>

                            <h1 className="mt-5 text-xl font-semibold text-slate-50">
                                Task not found
                            </h1>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                                The requested task could not be found or may no
                                longer be available.
                            </p>

                            <Link
                                href="/tasks"
                                className="mt-7 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                            >
                                Back to Tasks
                            </Link>
                        </div>
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

    const statusColor =
        task.status === "done"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : task.status === "in_progress"
                ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                : task.status === "review"
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                    : "border-slate-700 bg-slate-800/70 text-slate-400";

    const priorityColor =
        task.priority === "urgent"
            ? "text-rose-400"
            : task.priority === "high"
                ? "text-orange-400"
                : task.priority === "medium"
                    ? "text-amber-400"
                    : "text-slate-400";

    const priorityDot =
        task.priority === "urgent"
            ? "bg-rose-400"
            : task.priority === "high"
                ? "bg-orange-400"
                : task.priority === "medium"
                    ? "bg-amber-400"
                    : "bg-slate-500";

    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
                <header>
                    <Link
                        href="/tasks"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-indigo-400"
                    >
                        <span>←</span>
                        Back to Tasks
                    </Link>

                    <div className="mt-7 rounded-3xl border border-slate-800 bg-[#111827] p-5 sm:p-7 lg:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                    <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                        Task
                                    </span>

                                    <span className="text-slate-700">/</span>

                                    <span className="font-mono text-xs text-slate-500">
                                        #{task.id}
                                    </span>

                                    <span
                                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusColor}`}
                                    >
                                        {statusLabel}
                                    </span>
                                </div>

                                <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl lg:text-4xl">
                                    {task.title}
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                                    {task.description || "No description provided."}
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                                    <span>
                                        Project{" "}
                                        <span className="font-medium text-slate-300">
                                            {task.project.name}
                                        </span>
                                    </span>

                                    <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

                                    <span>
                                        Workspace{" "}
                                        <span className="font-medium text-slate-300">
                                            {task.project.workspace.name}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="mt-5 rounded-2xl border border-slate-800 bg-[#0F172A] p-3">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowStatusDropdown(
                                        !showStatusDropdown
                                    );
                                    setShowPriorityDropdown(false);
                                }}
                                disabled={changingStatus}
                                className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-indigo-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span>
                                    {changingStatus
                                        ? "Changing..."
                                        : "Change Status"}
                                </span>
                                <span className="text-slate-500">⌄</span>
                            </button>

                            {showStatusDropdown && (
                                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-[#111827] p-1.5 shadow-2xl shadow-black/30">
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
                                            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${task.status === option.value
                                                ? "cursor-default bg-indigo-500/10 text-indigo-400"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                } disabled:cursor-not-allowed disabled:opacity-50`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPriorityDropdown(
                                        !showPriorityDropdown
                                    );
                                    setShowStatusDropdown(false);
                                }}
                                disabled={changingPriority}
                                className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-amber-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span>
                                    {changingPriority
                                        ? "Changing..."
                                        : "Change Priority"}
                                </span>
                                <span className="text-slate-500">⌄</span>
                            </button>

                            {showPriorityDropdown && (
                                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-[#111827] p-1.5 shadow-2xl shadow-black/30">
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
                                            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${task.priority === option.value
                                                ? "cursor-default bg-amber-500/10 text-amber-400"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                } disabled:cursor-not-allowed disabled:opacity-50`}
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
                            className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-400 transition hover:border-sky-500/40 hover:bg-sky-500/15 hover:text-sky-300"
                        >
                            Edit Task
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400 transition hover:border-rose-500/40 hover:bg-rose-500/15 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {deleting ? "Deleting..." : "Delete Task"}
                        </button>
                    </div>
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
                    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-5 sm:p-7">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    Task Information
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    Details and ownership
                                </p>
                            </div>

                            <div className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] text-slate-500 sm:flex">
                                #
                            </div>
                        </div>

                        <div className="grid gap-x-8 gap-y-7 pt-6 sm:grid-cols-2">
                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Project
                                </p>
                                <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                    {task.project.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Workspace
                                </p>
                                <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                    {task.project.workspace.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Priority
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <span
                                        className={`h-2 w-2 rounded-full ${priorityDot}`}
                                    />
                                    <span
                                        className={`text-sm font-medium ${priorityColor}`}
                                    >
                                        {priorityLabel}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
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
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Assigned To
                                </p>

                                <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                    {assignee}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Created By
                                </p>

                                <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                    {createdBy}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-5 sm:p-7">
                        <div className="border-b border-slate-800 pb-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Timeline
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                                Task activity
                            </p>
                        </div>

                        <div className="relative mt-7 space-y-7 pl-6">
                            <div className="absolute bottom-4 left-[5px] top-2 w-px bg-slate-800" />

                            <div className="relative">
                                <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#111827] bg-indigo-400 ring-1 ring-indigo-500/30" />
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Created
                                </p>
                                <p className="mt-2 text-xs leading-5 text-slate-300">
                                    {new Date(
                                        task.created_at
                                    ).toLocaleString("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#111827] bg-sky-400 ring-1 ring-sky-500/30" />
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Last Updated
                                </p>
                                <p className="mt-2 text-xs leading-5 text-slate-300">
                                    {new Date(
                                        task.updated_at
                                    ).toLocaleString("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>

                            <div className="relative">
                                <span
                                    className={`absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#111827] ${task.completed_at
                                        ? "bg-emerald-400 ring-1 ring-emerald-500/30"
                                        : "bg-slate-700"
                                        }`}
                                />
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Completed
                                </p>
                                <p className="mt-2 text-xs leading-5 text-slate-300">
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