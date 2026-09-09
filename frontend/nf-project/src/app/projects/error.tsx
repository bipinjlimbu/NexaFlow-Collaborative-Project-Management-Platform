"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ProjectsError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("Projects Error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6 py-12 selection:bg-indigo-500 selection:text-white">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-lg shadow-red-500/5">
                    <AlertTriangle size={32} />
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-3">
                    ApexStriker System Alert
                </span>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Failed to load projects
                </h1>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    An error occurred while fetching your project data from the API. Please try re-authenticating or refreshing the component.
                </p>

                {error.message && (
                    <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-left backdrop-blur-sm">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Error Log
                        </p>
                        <p className="font-mono text-xs text-red-400 break-words leading-relaxed">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="mt-2 text-[10px] text-slate-600 font-mono">
                                Digest ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/20"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                    >
                        <Home size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}