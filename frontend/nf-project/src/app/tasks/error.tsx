"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-slate-50">
            <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center shadow-2xl backdrop-blur-sm">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-2xl font-bold text-rose-400">
                    !
                </div>

                <div className="mb-2 flex items-center justify-center gap-2">
                    <span className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-400">
                        System Error
                    </span>
                    <span className="text-xs text-slate-600">/</span>
                    <span className="font-mono text-[11px] text-slate-500">
                        NEXAFLOW
                    </span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    An unexpected error occurred while processing your request. You can try again or navigate back to safety.
                </p>

                {error.digest && (
                    <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                        <p className="font-mono text-[11px] text-slate-500">
                            Error Digest: {error.digest}
                        </p>
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500"
                    >
                        Try again
                    </button>

                    <Link
                        href="/tasks"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-5 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                    >
                        Back to Tasks
                    </Link>
                </div>
            </div>
        </main>
    );
}