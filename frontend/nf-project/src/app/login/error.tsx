"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LoginError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Login Segment Error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-5 rounded-2xl border border-rose-500/30 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Something went wrong
                    </h2>
                    <p className="text-xs text-slate-400">
                        {error.message || "An unexpected error occurred on the login page."}
                    </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <button
                        onClick={() => reset()}
                        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </main>
    );
}