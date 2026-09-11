"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
                    <TriangleAlert size={24} />
                </div>

                <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-red-400">
                    Profile Error
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    We couldn&apos;t load your profile right now. Please try
                    again.
                </p>

                <button
                    onClick={() => reset()}
                    className="mt-6 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 text-sm font-medium text-white transition hover:bg-indigo-400"
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        </main>
    );
}