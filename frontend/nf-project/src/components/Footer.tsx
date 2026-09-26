import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-slate-800/80 bg-[#020617] px-4 py-12 text-slate-400 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2.5"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-base font-bold text-white shadow-lg shadow-indigo-500/20 transition group-hover:bg-indigo-400">
                                N
                            </div>

                            <span className="text-lg font-semibold tracking-tight text-slate-50">
                                NexaFlow
                            </span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
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
                                    Hierarchy
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