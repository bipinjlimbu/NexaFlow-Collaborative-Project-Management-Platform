"use client";

import { useEffect } from "react";

export default function NotificationsError({
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
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
                <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center shadow-2xl">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-xl font-semibold text-red-400">
                        !
                    </div>

                    <h1 className="mt-6 text-xl font-semibold text-white">
                        Something went wrong
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        We couldn&apos;t load the notifications page.
                        Please try again.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="mt-6 cursor-pointer rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                    >
                        Try again
                    </button>
                </div>
            </div>
        </div>
    );
}
