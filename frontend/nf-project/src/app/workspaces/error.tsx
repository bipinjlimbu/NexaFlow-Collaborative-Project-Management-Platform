"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

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
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
            <div className="max-w-md w-full rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-sm text-center space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertTriangle className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Something went wrong
                    </h2>
                    <p className="text-sm text-slate-400">
                        Failed to load workspaces data. Please try again or refresh the page.
                    </p>
                </div>

                <button
                    onClick={() => reset()}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/20"
                >
                    <RotateCcw className="w-4 h-4" />
                    Try again
                </button>
            </div>
        </main>
    );
}