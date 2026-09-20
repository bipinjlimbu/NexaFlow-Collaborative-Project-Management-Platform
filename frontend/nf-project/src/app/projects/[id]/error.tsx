"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function ProjectDetailError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
                <div className="w-full max-w-lg rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center backdrop-blur-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                        <AlertCircle size={26} />
                    </div>

                    <h1 className="mt-5 text-xl font-semibold text-white">
                        Something went wrong
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        We couldn&apos;t load this project. Please try again.
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                        >
                            <RefreshCw size={17} />
                            Try again
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/projects")}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                        >
                            <ArrowLeft size={17} />
                            Back to projects
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}