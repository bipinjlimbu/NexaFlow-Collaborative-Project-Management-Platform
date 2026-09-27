"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    deleteNotification,
    getNotifications,
    markNotificationAsRead,
} from "@/services/notificationService";
import type { Notification } from "@/types/notification";
import NotificationsSkeleton from "@/components/NotificationsSkeleton";

function getNotificationRoute(type: string) {
    switch (type.toUpperCase()) {
        case "INVITATION":
            return "/invitations";
        case "WORKSPACES":
            return "/workspaces";
        case "PROJECTS":
            return "/projects";
        case "TASKS":
            return "/tasks";
        case "DASHBOARD":
            return "/dashboard";
        default:
            return null;
    }
}

function getNotificationTypeStyle(type: string) {
    switch (type.toUpperCase()) {
        case "INVITATION":
            return "border-indigo-500/20 bg-indigo-500/10 text-indigo-400";
        case "WORKSPACES":
            return "border-sky-500/20 bg-sky-500/10 text-sky-400";
        case "PROJECTS":
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
        case "TASKS":
            return "border-amber-500/20 bg-amber-500/10 text-amber-400";
        case "DASHBOARD":
            return "border-violet-500/20 bg-violet-500/10 text-violet-400";
        default:
            return "border-slate-700 bg-slate-800/70 text-slate-400";
    }
}

function formatNotificationDate(date: string) {
    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
        now.getTime() - notificationDate.getTime();

    const seconds = Math.floor(difference / 1000);

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString();
}

export default function NotificationsPage() {
    const router = useRouter();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const access = localStorage.getItem("access");

        if (!access) {
            router.replace("/login");
            return;
        }

        async function loadNotifications() {
            try {
                setLoading(true);
                setError("");

                const data = await getNotifications();

                setNotifications(data);
            } catch (err: any) {
                if (err && typeof err === "object") {
                    const messages = Object.values(err)
                        .filter(
                            (message) =>
                                typeof message === "string"
                        )
                        .join(" ");

                    setError(
                        messages ||
                        "Unable to load notifications."
                    );
                } else {
                    setError("Unable to load notifications.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadNotifications();
    }, [router]);

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                (notification) => !notification.is_read
            ).length,
        [notifications]
    );

    const handleNotificationClick = async (
        notification: Notification
    ) => {
        const route = getNotificationRoute(notification.type);

        try {
            if (!notification.is_read) {
                const updatedNotification =
                    await markNotificationAsRead(notification.id);

                setNotifications((currentNotifications) =>
                    currentNotifications.map((item) =>
                        item.id === updatedNotification.id
                            ? updatedNotification
                            : item
                    )
                );
            }

            if (route) {
                router.push(route);
            }
        } catch (err) {
            if (route) {
                router.push(route);
            }
        }
    };

    const handleDeleteNotification = async (
        id: number
    ) => {
        try {
            setDeletingId(id);

            await deleteNotification(id);

            setNotifications((currentNotifications) =>
                currentNotifications.filter(
                    (notification) =>
                        notification.id !== id
                )
            );
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .filter(
                        (message) =>
                            typeof message === "string"
                    )
                    .join(" ");

                setError(
                    messages ||
                    "Unable to delete notification."
                );
            } else {
                setError(
                    "Unable to delete notification."
                );
            }
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <NotificationsSkeleton />;
    }

    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <button
                    onClick={() => router.back()}
                    className="mb-7 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-200"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back
                </button>

                <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-2xl shadow-black/20">
                    <div className="border-b border-slate-800 px-5 py-6 sm:px-7 sm:py-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                    Activity
                                </div>

                                <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                                    Notifications
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                                    Stay updated with activity across
                                    NexaFlow.
                                </p>
                            </div>

                            {unreadCount > 0 && (
                                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-2.5 text-sm font-medium text-indigo-400">
                                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                                    {unreadCount} unread
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="border-b border-rose-500/20 bg-rose-500/[0.05] px-5 py-4 sm:px-7">
                            <div className="flex items-start gap-3 text-sm text-rose-400">
                                <svg
                                    className="mt-0.5 h-4 w-4 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v3.5m0 3h.01M10.29 3.86l-7.17 12a2 2 0 001.71 3h14.34a2 2 0 001.71-3l-7.17-12a2 2 0 00-3.42 0z"
                                    />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {!error && notifications.length === 0 && (
                        <div className="px-5 py-20 text-center sm:px-7">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-[#0F172A] text-emerald-400">
                                <svg
                                    className="h-7 w-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h2 className="mt-5 text-lg font-semibold text-slate-200">
                                You&apos;re all caught up
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                You don&apos;t have any notifications
                                right now.
                            </p>
                        </div>
                    )}

                    {notifications.length > 0 && (
                        <div className="divide-y divide-slate-800/70">
                            {notifications.map((notification) => {
                                const route =
                                    getNotificationRoute(
                                        notification.type
                                    );

                                const isDeleting =
                                    deletingId ===
                                    notification.id;

                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                        className={`group relative transition-colors ${notification.is_read
                                                ? "bg-[#111827] hover:bg-[#0F172A]"
                                                : "bg-indigo-500/[0.035] hover:bg-indigo-500/[0.06]"
                                            } ${route
                                                ? "cursor-pointer"
                                                : "cursor-default"
                                            }`}
                                    >
                                        {!notification.is_read && (
                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-500" />
                                        )}

                                        <div className="flex items-start gap-4 px-5 py-5 sm:gap-5 sm:px-7">
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-[10px] font-bold uppercase tracking-wider sm:h-12 sm:w-12 ${getNotificationTypeStyle(
                                                    notification.type
                                                )}`}
                                            >
                                                {notification.type
                                                    .slice(0, 3)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <h2
                                                            className={`min-w-0 truncate text-sm font-semibold sm:text-[15px] ${notification.is_read
                                                                    ? "text-slate-300"
                                                                    : "text-slate-50"
                                                                }`}
                                                        >
                                                            {
                                                                notification.title
                                                            }
                                                        </h2>

                                                        {!notification.is_read && (
                                                            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                                                        )}
                                                    </div>

                                                    <span className="shrink-0 text-xs font-medium text-slate-600">
                                                        {formatNotificationDate(
                                                            notification.created_at
                                                        )}
                                                    </span>
                                                </div>

                                                <p
                                                    className={`mt-2 max-w-3xl text-sm leading-6 ${notification.is_read
                                                            ? "text-slate-500"
                                                            : "text-slate-400"
                                                        }`}
                                                >
                                                    {
                                                        notification.message
                                                    }
                                                </p>

                                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <span
                                                        className={`w-fit rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${getNotificationTypeStyle(
                                                            notification.type
                                                        )}`}
                                                    >
                                                        {
                                                            notification.type
                                                        }
                                                    </span>

                                                    <div className="flex items-center gap-4">
                                                        {route && (
                                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors group-hover:text-indigo-400">
                                                                Open
                                                                <svg
                                                                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M9 5l7 7-7 7"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        )}

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();

                                                                handleDeleteNotification(
                                                                    notification.id
                                                                );
                                                            }}
                                                            className="cursor-pointer text-xs font-medium text-slate-500 transition hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {isDeleting
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}