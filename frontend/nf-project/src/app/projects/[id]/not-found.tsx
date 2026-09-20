"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 font-mono text-sm font-semibold text-indigo-400">
                    404
                </div>

                <p className="mt-6 font-mono text-xs uppercase tracking-widest text-indigo-400">
                    Project not found
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                    This project doesn't exist
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    The project you're looking for may have been deleted,
                    moved, or you may not have access to it.
                </p>

                <button
                    onClick={() => router.push("/projects")}
                    className="mt-7 cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                    Back to projects
                </button>
            </div>
        </div>
    );
}