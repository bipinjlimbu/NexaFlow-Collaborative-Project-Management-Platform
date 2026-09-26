"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] px-4 text-slate-50 sm:px-6">
            <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center py-12">
                <div className="w-full max-w-lg text-center">
                    <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-800 bg-[#111827] shadow-2xl shadow-black/20">
                        <div className="absolute inset-0 rounded-3xl bg-indigo-500/5" />

                        <span className="relative font-mono text-2xl font-semibold tracking-tight text-indigo-400">
                            404
                        </span>
                    </div>

                    <div className="mt-8 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                        Workspace not found
                    </div>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                        This workspace doesn&apos;t exist
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                        The workspace you&apos;re looking for may have been
                        deleted, moved, or you may not have access to it.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => router.push("/workspaces")}
                            className="cursor-pointer rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            Back to Workspaces
                        </button>
                    </div>

                    <div className="mx-auto mt-10 h-px w-24 bg-slate-800" />

                    <p className="mt-4 text-xs text-slate-600">
                        Check the workspace address or return to your workspace list.
                    </p>
                </div>
            </div>
        </div>
    );
}