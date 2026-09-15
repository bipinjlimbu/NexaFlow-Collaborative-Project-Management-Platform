"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InvitationsError({
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
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
                <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-xl text-red-400">
                        !
                    </div>

                    <h1 className="mt-6 text-xl font-semibold tracking-tight text-white">
                        Something went wrong
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        We couldn&apos;t load your invitations. Please try
                        again or return to the previous page.
                    </p>

                    <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
                        >
                            Try again
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-200"
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
