"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getNotifications,
    markNotificationAsRead,
    Notification,
} from "@/services/notificationService";
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
            return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
        case "WORKSPACES":
            return "bg-sky-500/10 text-sky-400 border-sky-500/20";
        case "PROJECTS":
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "TASKS":
            return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        case "DASHBOARD":
            return "bg-violet-500/10 text-violet-400 border-violet-500/20";
        default:
            return "bg-slate-800/70 text-slate-400 border-slate-700";
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

    if (loading) {
        return <NotificationsSkeleton />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="mb-6 cursor-pointer text-sm font-medium text-slate-500 transition hover:text-slate-200"
                    >
                        ← Back
                    </button>

                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Notifications
                        </h1>

                        {unreadCount > 0 && (
                            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        Stay updated with activity across NexaFlow.
                    </p>
                </div>

                {error && (
                    <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {!error && notifications.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 px-6 py-20 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-xl text-slate-500 shadow-lg">
                            ✓
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-slate-200">
                            You&apos;re all caught up
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            You don&apos;t have any notifications right now.
                        </p>
                    </div>
                )}

                {notifications.length > 0 && (
                    <div className="mt-8 space-y-3">
                        {notifications.map((notification) => {
                            const route =
                                getNotificationRoute(
                                    notification.type
                                );

                            return (
                                <div
                                    key={notification.id}
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${notification.is_read
                                        ? "border-slate-800/80 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/60"
                                        : "border-indigo-500/20 bg-slate-900/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-indigo-500/30 hover:bg-slate-900/80"
                                        } ${route
                                            ? "cursor-pointer"
                                            : "cursor-default"
                                        }`}
                                >
                                    {!notification.is_read && (
                                        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500" />
                                    )}

                                    <div className="flex items-start gap-4 p-5 sm:p-6">
                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xs font-bold uppercase tracking-wide ${getNotificationTypeStyle(
                                                notification.type
                                            )}`}
                                        >
                                            {notification.type
                                                .slice(0, 3)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <h2
                                                        className={`truncate text-[15px] font-semibold ${notification.is_read
                                                            ? "text-slate-300"
                                                            : "text-white"
                                                            }`}
                                                    >
                                                        {
                                                            notification.title
                                                        }
                                                    </h2>

                                                    {!notification.is_read && (
                                                        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.65)]" />
                                                    )}
                                                </div>

                                                <span className="shrink-0 pt-0.5 text-xs font-medium text-slate-600">
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

                                            <div className="mt-4 flex items-center justify-between">
                                                <span
                                                    className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${getNotificationTypeStyle(
                                                        notification.type
                                                    )}`}
                                                >
                                                    {
                                                        notification.type
                                                    }
                                                </span>

                                                {route && (
                                                    <span className="flex items-center gap-1 text-xs font-medium text-slate-600 transition-all duration-200 group-hover:text-indigo-400">
                                                        Open
                                                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                                                            →
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}