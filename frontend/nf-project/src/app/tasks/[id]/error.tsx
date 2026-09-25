"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
                <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center shadow-xl">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                        <AlertTriangle size={26} />
                    </div>

                    <h1 className="mt-5 text-xl font-semibold text-white">
                        Something went wrong
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        We couldn&apos;t load this task. Please try again or
                        return to the tasks page.
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-500"
                        >
                            <RefreshCw size={16} />
                            Try again
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/tasks")}
                            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to tasks
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}