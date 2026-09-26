"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FolderKanban } from "lucide-react";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center">
                <div className="w-full max-w-lg">
                    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]">
                        <div className="border-b border-slate-800 px-6 py-7 text-center sm:px-8 sm:py-9">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                                <FolderKanban className="h-7 w-7 text-indigo-400" />
                            </div>

                            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                                Project not found
                            </p>

                            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                                This project doesn't exist
                            </h1>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                                The project you're looking for may have been
                                deleted, moved, or you may not have access to it.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 bg-[#0F172A] px-6 py-5 sm:flex-row sm:justify-center sm:px-8">
                            <button
                                type="button"
                                onClick={() => router.push("/projects")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to projects
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}