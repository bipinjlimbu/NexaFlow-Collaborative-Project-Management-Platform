export default function InvitationsSkeleton() {
    return (<div className="min-h-screen bg-slate-950 text-white"> <div className="mx-auto max-w-5xl px-6 py-8"> <div className="mb-8"> <div className="mb-7 h-4 w-20 animate-pulse rounded bg-slate-800" />

        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800" />

        <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-800" />
    </div>

        <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40"
                >
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex min-w-0 gap-4">
                                <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-800" />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-40 animate-pulse rounded bg-slate-800" />
                                        <div className="h-5 w-16 animate-pulse rounded-md bg-slate-800" />
                                    </div>

                                    <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded bg-slate-800" />

                                    <div className="mt-2 h-4 w-3/4 max-w-md animate-pulse rounded bg-slate-800" />

                                    <div className="mt-5 flex gap-6">
                                        <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                                        <div className="h-3 w-28 animate-pulse rounded bg-slate-800" />
                                    </div>
                                </div>
                            </div>

                            <div className="h-8 w-20 shrink-0 animate-pulse rounded-lg bg-slate-800" />
                        </div>

                        <div className="mt-5 flex items-center gap-3 border-t border-slate-800/70 pt-4">
                            <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-800" />

                            <div className="space-y-2">
                                <div className="h-3 w-16 animate-pulse rounded bg-slate-800" />
                                <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
                            </div>

                            <div className="ml-auto hidden h-3 w-20 animate-pulse rounded bg-slate-800 sm:block" />
                        </div>

                        <div className="mt-5 flex flex-col gap-2 border-t border-slate-800/70 pt-5 sm:flex-row sm:justify-end">
                            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800 sm:w-24" />

                            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800 sm:w-40" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    </div>
    );

}
