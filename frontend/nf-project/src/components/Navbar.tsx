"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const access = localStorage.getItem("access");
        setIsAuthenticated(!!access);
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105">
                        N
                    </div>

                    <span className="text-xl font-bold tracking-tight text-white">
                        NexaFlow
                    </span>
                </Link>

                {isAuthenticated ? (
                    <>
                        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-400 md:flex">
                            <Link href="/dashboard" className="transition-colors hover:text-white">
                                Dashboard
                            </Link>

                            <Link href="/workspaces" className="transition-colors hover:text-white">
                                Workspaces
                            </Link>

                            <Link href="/projects" className="transition-colors hover:text-white">
                                Projects
                            </Link>

                            <Link href="/tasks" className="transition-colors hover:text-white">
                                Tasks
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                className="relative rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white"
                                aria-label="Notifications"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>

                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                            </button>

                            <div className="hidden items-center gap-3 border-l border-slate-800 pl-2 sm:flex">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                                    BP
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-slate-200">
                                        Bipin
                                    </div>

                                    <div className="text-[10px] text-slate-500">
                                        Workspace Owner
                                    </div>
                                </div>
                            </div>

                            <LogoutButton
                                onLogout={() => setIsAuthenticated(false)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
                            <Link href="/#features" className="transition-colors hover:text-white">
                                Features
                            </Link>

                            <Link href="/#hierarchy" className="transition-colors hover:text-white">
                                Structure
                            </Link>

                            <Link href="/#about" className="transition-colors hover:text-white">
                                About
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-slate-300 hover:text-white"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
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