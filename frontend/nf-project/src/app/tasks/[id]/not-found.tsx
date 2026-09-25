import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
                <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center shadow-xl">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                        <SearchX size={26} />
                    </div>

                    <h1 className="mt-5 text-xl font-semibold text-white">
                        Task not found
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        The task you are looking for doesn&apos;t exist or may
                        have been deleted.
                    </p>

                    <Link
                        href="/tasks"
                        className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        <ArrowLeft size={16} />
                        Back to tasks
                    </Link>
                </div>
            </div>
        </main>
    );
}