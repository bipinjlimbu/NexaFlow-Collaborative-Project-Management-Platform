import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-[#111827] p-7 text-center shadow-2xl shadow-black/20 sm:p-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                        <SearchX size={28} strokeWidth={1.8} />
                    </div>

                    <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-400">
                        Task not found
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                        This task doesn&apos;t exist
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                        The task you&apos;re looking for may have been deleted,
                        moved, or is no longer available.
                    </p>

                    <Link
                        href="/tasks"
                        className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                    >
                        <ArrowLeft size={16} />
                        Back to Tasks
                    </Link>
                </div>
            </div>
        </main>
    );
}