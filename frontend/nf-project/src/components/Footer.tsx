"use client";

import Image from "next/image";
import Link from "next/link";
import NFLOGO from "@/images/NFLOGO.png";

export default function Footer() {
    return (
        <footer className="border-t border-slate-800/80 bg-[#020617] px-4 py-12 text-slate-400 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
                    <div>
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#111827] p-2 transition group-hover:border-indigo-500/30 group-hover:bg-[#151d2d]">
                                <Image
                                    src={NFLOGO}
                                    alt="NexaFlow"
                                    width={32}
                                    height={32}
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div>
                                <span className="block text-lg font-semibold tracking-tight text-slate-50">
                                    NexaFlow
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                                    Work management
                                </span>
                            </div>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
                            Collaborative project management for modern teams,
                            workspaces, and projects.
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-[#0F172A] px-3 py-1.5 text-xs text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            System Operational
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                            Platform
                        </h4>

                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/workspaces"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    Workspaces
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/projects"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tasks"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    Tasks
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                            Product
                        </h4>

                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a
                                    href="#features"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#hierarchy"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    Structure
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    About
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                            Account
                        </h4>

                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link
                                    href="/login"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/register"
                                    className="transition-colors hover:text-slate-50"
                                >
                                    Get Started
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/70 pt-7 text-xs text-slate-500 sm:flex-row">
                    <p>© 2026 NexaFlow. All rights reserved.</p>

                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>System Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}