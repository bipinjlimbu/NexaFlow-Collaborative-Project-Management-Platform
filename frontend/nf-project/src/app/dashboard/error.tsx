'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
            <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-100">
                        Something went wrong
                    </h2>
                    <p className="text-sm text-slate-400">
                        An error occurred while loading the dashboard. You can try refreshing the component or returning home.
                    </p>
                </div>

                {error.message && (
                    <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs font-mono text-rose-400 text-left overflow-x-auto max-h-28">
                        {error.message}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>

                    <a
                        href="/"
                        className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors duration-200 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-slate-700/50"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}