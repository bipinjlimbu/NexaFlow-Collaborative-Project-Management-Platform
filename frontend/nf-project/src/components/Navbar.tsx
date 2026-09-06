"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        function checkAuth() {
            const access = localStorage.getItem("access");
            setIsAuthenticated(!!access);
        }

        checkAuth();

        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("auth-change", checkAuth);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                        N
                    </div>

                    <span className="font-bold text-xl tracking-tight text-white">
                        NexaFlow
                    </span>
                </Link>

                {isAuthenticated ? (
                    <>
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                            <Link href="/dashboard" className="hover:text-white transition-colors">
                                Dashboard
                            </Link>

                            <Link href="/workspaces" className="hover:text-white transition-colors">
                                Workspaces
                            </Link>

                            <Link href="/projects" className="hover:text-white transition-colors">
                                Projects
                            </Link>

                            <Link href="/tasks" className="hover:text-white transition-colors">
                                Tasks
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors relative"
                                aria-label="Notifications"
                            >
                                <svg
                                    className="w-5 h-5"
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

                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                            </button>

                            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-medium text-xs flex items-center justify-center">
                                    BP
                                </div>

                                <div className="hidden sm:block text-left">
                                    <div className="text-xs font-semibold text-slate-200">
                                        Bipin
                                    </div>

                                    <div className="text-[10px] text-slate-500">
                                        Workspace Owner
                                    </div>
                                </div>
                            </div>

                            <LogoutButton />
                        </div>
                    </>
                ) : (
                    <>
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                            <Link href="/#features" className="hover:text-white transition-colors">
                                Features
                            </Link>

                            <Link href="/#hierarchy" className="hover:text-white transition-colors">
                                Structure
                            </Link>

                            <Link href="/#about" className="hover:text-white transition-colors">
                                About
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/register"
                                className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
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