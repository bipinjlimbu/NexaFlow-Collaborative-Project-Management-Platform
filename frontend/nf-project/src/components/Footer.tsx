import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="space-y-4 md:col-span-1">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-indigo-600/30">
                            N
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">
                            NexaFlow
                        </span>
                    </Link>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Collaborative project management platform for modern teams, workspaces, and projects.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
                        Platform
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                        <li>
                            <Link href="/dashboard" className="hover:text-white transition-colors">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/workspaces" className="hover:text-white transition-colors">
                                Workspaces
                            </Link>
                        </li>
                        <li>
                            <Link href="/projects" className="hover:text-white transition-colors">
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link href="/tasks" className="hover:text-white transition-colors">
                                Tasks
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
                        Product
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                        <li>
                            <a href="#features" className="hover:text-white transition-colors">
                                Features
                            </a>
                        </li>
                        <li>
                            <a href="#hierarchy" className="hover:text-white transition-colors">
                                Hierarchy
                            </a>
                        </li>
                        <li>
                            <a href="#about" className="hover:text-white transition-colors">
                                About
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
                        Account
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                        <li>
                            <Link href="/login" className="hover:text-white transition-colors">
                                Sign In
                            </Link>
                        </li>
                        <li>
                            <Link href="/register" className="hover:text-white transition-colors">
                                Get Started
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <p>© 2026 NexaFlow. All rights reserved.</p>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>System Operational</span>
                </div>
            </div>
        </footer>
    );
}