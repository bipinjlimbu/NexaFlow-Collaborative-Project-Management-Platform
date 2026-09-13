"use client";

import { useRouter } from "next/navigation";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-xl font-semibold text-red-400">
                    !
                </div>

                <p className="mt-6 font-mono text-xs uppercase tracking-widest text-red-400">
                    Workspace error
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    We couldn't load this workspace. Please try again or
                    return to your workspaces.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        onClick={() => reset()}
                        className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        Try again
                    </button>

                    <button
                        onClick={() => router.push("/workspaces")}
                        className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                    >
                        Back to workspaces
                    </button>
                </div>
            </div>
        </div>
    );
}