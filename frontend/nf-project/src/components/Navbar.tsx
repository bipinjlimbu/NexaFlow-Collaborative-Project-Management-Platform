"use client";

import Image from "next/image";
import { Bell, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarSkeleton from "@/components/NavbarSkeleton";
import { getNotifications } from "@/services/notificationService";
import NFLOGO from "@/images/NFLOGO.png";

type User = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
};

export default function Navbar() {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [hasNotifications, setHasNotifications] = useState(false);

    const API_URL =
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

    useEffect(() => {
        function checkAuth() {
            const access = localStorage.getItem("access");
            const storedUser = localStorage.getItem("user");

            setIsAuthenticated(!!access);

            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        }

        checkAuth();

        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("auth-change", checkAuth);
        };
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setHasNotifications(false);
            return;
        }

        async function loadNotifications() {
            try {
                const notifications = await getNotifications();

                setHasNotifications(
                    notifications.some(
                        (notification) => !notification.is_read
                    )
                );
            } catch {
                setHasNotifications(false);
            }
        }

        loadNotifications();
    }, [isAuthenticated, pathname]);

    if (isAuthenticated === null) {
        return <NavbarSkeleton />;
    }

    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#020617]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="group flex shrink-0 items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#111827] p-2 shadow-lg shadow-black/10 transition group-hover:border-indigo-500/30 group-hover:bg-[#151d2d]">
                        <Image
                            src={NFLOGO}
                            alt="NexaFlow"
                            width={32}
                            height={32}
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div className="hidden sm:block">
                        <div className="text-[15px] font-semibold tracking-tight text-slate-50">
                            NexaFlow
                        </div>
                        <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                            Work management
                        </div>
                    </div>
                </Link>

                {isAuthenticated ? (
                    <>
                        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-slate-800/80 bg-[#0F172A]/80 p-1 md:flex">
                            {[
                                { href: "/dashboard", label: "Dashboard" },
                                { href: "/workspaces", label: "Workspaces" },
                                { href: "/projects", label: "Projects" },
                                { href: "/tasks", label: "Tasks" },
                            ].map((item) => {
                                const active = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${active
                                            ? "bg-slate-800 text-slate-50 shadow-sm"
                                            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/notifications"
                                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${pathname === "/notifications"
                                    ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                                    : "border-slate-800 bg-[#111827] text-slate-400 hover:border-slate-700 hover:bg-[#151d2d] hover:text-slate-100"
                                    }`}
                                aria-label="Notifications"
                            >
                                <Bell
                                    size={18}
                                    strokeWidth={1.8}
                                />

                                {hasNotifications && (
                                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-400 ring-2 ring-[#111827]" />
                                )}
                            </Link>

                            <Link
                                href="/profile"
                                className={`flex items-center gap-2.5 rounded-xl border py-1.5 pl-1.5 pr-2.5 transition sm:gap-3 ${pathname === "/profile"
                                    ? "border-slate-700 bg-[#111827]"
                                    : "border-transparent hover:border-slate-800 hover:bg-[#111827]"
                                    }`}
                            >
                                {user?.profile_picture ? (
                                    <img
                                        src={`${API_URL}${user.profile_picture}`}
                                        alt={
                                            user.first_name ||
                                            user.username
                                        }
                                        className="h-8 w-8 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-xs font-semibold text-white">
                                        {user?.first_name?.[0]?.toUpperCase() ||
                                            user?.username?.[0]?.toUpperCase() ||
                                            "U"}
                                    </div>
                                )}

                                <div className="hidden min-w-0 text-left sm:block">
                                    <div className="max-w-[110px] truncate text-xs font-semibold text-slate-200">
                                        {user?.first_name ||
                                            user?.username ||
                                            "User"}
                                    </div>

                                    <div className="mt-0.5 text-[10px] text-slate-500">
                                        Workspace Owner
                                    </div>
                                </div>

                                <ChevronDown
                                    size={14}
                                    strokeWidth={1.8}
                                    className="hidden text-slate-500 sm:block"
                                />
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
                            {[
                                { href: "/#features", label: "Features" },
                                { href: "/#hierarchy", label: "Structure" },
                                { href: "/#about", label: "About" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/50 hover:text-slate-100"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/login"
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${pathname === "/login"
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                    }`}
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/15 transition hover:bg-indigo-400 active:scale-[0.98]"
                            >
                                Get Started
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}