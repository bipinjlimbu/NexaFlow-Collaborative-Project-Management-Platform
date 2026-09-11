"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileSkeleton from "@/components/ProfileSkeleton";

interface User {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    address?: string;
    profile_picture?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

    useEffect(() => {
        const access = localStorage.getItem("access");
        const storedUser = localStorage.getItem("user");

        if (!access || !storedUser) {
            setIsAuthenticated(false);
            router.replace("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            setUser(parsedUser);
            setIsAuthenticated(true);
        } catch {
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            router.replace("/login");
        }
    }, [router]);

    if (isAuthenticated === null || !user) {
        return <ProfileSkeleton />;
    }

    if (!isAuthenticated) {
        return <ProfileSkeleton />;
    }

    const fullName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username ||
        "User";

    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <Link
                            href="/dashboard"
                            className="cursor-pointer transition hover:text-slate-300"
                        >
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-slate-400">Profile</span>
                    </div>

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-indigo-400">
                                Account
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight">
                                Profile
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Manage your personal information and account preferences.
                            </p>
                        </div>

                        <Link
                            href="/profile/edit"
                            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-indigo-500 px-4 text-sm font-medium text-white transition hover:bg-indigo-400"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                <section className="mb-6 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="h-28 bg-gradient-to-r from-indigo-500/20 via-slate-900 to-sky-500/10" />

                    <div className="px-6 pb-6">
                        <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end">
                                {user.profile_picture ? (
                                    <img
                                        src={`${API_URL}${user.profile_picture} `}
                                        alt={fullName}
                                        className="h-24 w-24 rounded-2xl border-4 border-slate-950 object-cover shadow-xl"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-slate-950 bg-indigo-500 text-2xl font-semibold text-white shadow-xl">
                                        {initials}
                                    </div>
                                )}

                                <div className="pb-1">
                                    <h2 className="text-2xl font-semibold text-white">
                                        {fullName}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        @{user.username || "user"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-start md:self-auto">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 lg:col-span-2">
                        <div className="border-b border-slate-800/80 px-6 py-5">
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                Personal Information
                            </p>

                            <h2 className="mt-1 text-lg font-semibold">
                                Account Details
                            </h2>
                        </div>

                        <div className="grid gap-px bg-slate-800/60 sm:grid-cols-2">
                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    First Name
                                </p>

                                <p className="text-sm text-slate-200">
                                    {user.first_name || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Last Name
                                </p>

                                <p className="text-sm text-slate-200">
                                    {user.last_name || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Username
                                </p>

                                <p className="text-sm text-slate-200">
                                    {user.username || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Email
                                </p>

                                <p className="break-all text-sm text-slate-200">
                                    {user.email || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Phone Number
                                </p>

                                <p className="text-sm text-slate-200">
                                    {user.phone_number || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6 sm:col-span-2">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Address
                                </p>

                                <p className="text-sm text-slate-200">
                                    {user.address || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="space-y-6">
                        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40">
                            <div className="border-b border-slate-800/80 px-6 py-5">
                                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                    Account
                                </p>

                                <h2 className="mt-1 text-lg font-semibold">
                                    Security
                                </h2>
                            </div>

                            <div className="divide-y divide-slate-800/80">
                                <Link
                                    href="/profile/password"
                                    className="flex cursor-pointer items-center justify-between px-6 py-5 transition hover:bg-slate-800/30"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            Change Password
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Update your account password
                                        </p>
                                    </div>

                                    <span className="text-slate-600">→</span>
                                </Link>

                                <Link
                                    href="/profile/sessions"
                                    className="flex cursor-pointer items-center justify-between px-6 py-5 transition hover:bg-slate-800/30"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            Active Sessions
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Review your logged-in devices
                                        </p>
                                    </div>

                                    <span className="text-slate-600">→</span>
                                </Link>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40">
                            <div className="border-b border-slate-800/80 px-6 py-5">
                                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                    Preferences
                                </p>

                                <h2 className="mt-1 text-lg font-semibold">
                                    Notifications
                                </h2>
                            </div>

                            <div className="divide-y divide-slate-800/80">
                                <div className="flex items-center justify-between px-6 py-5">
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            Task Updates
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Receive updates about assigned tasks
                                        </p>
                                    </div>

                                    <div className="h-5 w-9 rounded-full bg-indigo-500 p-0.5">
                                        <div className="ml-4 h-4 w-4 rounded-full bg-white" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-6 py-5">
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            Mentions
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Get notified when someone mentions you
                                        </p>
                                    </div>

                                    <div className="h-5 w-9 rounded-full bg-indigo-500 p-0.5">
                                        <div className="ml-4 h-4 w-4 rounded-full bg-white" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="border-b border-slate-800/80 px-6 py-5">
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                            Workspace
                        </p>

                        <h2 className="mt-1 text-lg font-semibold">
                            Your Overview
                        </h2>
                    </div>

                    <div className="grid gap-px bg-slate-800/60 sm:grid-cols-3">
                        <div className="bg-slate-900/60 p-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Workspaces
                            </p>

                            <p className="mt-2 text-2xl font-semibold">04</p>

                            <p className="mt-1 text-xs text-slate-600">
                                Active memberships
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Projects
                            </p>

                            <p className="mt-2 text-2xl font-semibold">12</p>

                            <p className="mt-1 text-xs text-slate-600">
                                Across your workspaces
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Tasks
                            </p>

                            <p className="mt-2 text-2xl font-semibold">19</p>

                            <p className="mt-1 text-xs text-slate-600">
                                Currently pending
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}