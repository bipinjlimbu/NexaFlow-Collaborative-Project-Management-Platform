export default function WorkspacesSkeleton() {
    return (
        <main className="min-h-screen overflow-x-hidden bg-[#020617] text-[#F8FAFC]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <div className="animate-pulse">
                    <div className="mb-8 flex flex-col justify-between gap-6 border-b border-slate-800/70 pb-7 sm:flex-row sm:items-end">
                        <div className="max-w-2xl">
                            <div className="mb-4 h-7 w-40 rounded-full bg-indigo-500/10" />

                            <div className="h-9 w-48 rounded-xl bg-slate-800/80 sm:w-56" />

                            <div className="mt-2 h-4 w-full max-w-xl rounded bg-slate-800/50" />
                        </div>

                        <div className="h-11 w-full rounded-xl bg-indigo-500/20 sm:w-40" />
                    </div>

                    <div className="mb-8 flex h-12 items-center rounded-xl border border-slate-800 bg-[#0F172A] px-4">
                        <div className="h-4 w-4 rounded-full bg-slate-800" />
                        <div className="ml-3 h-3 w-40 rounded bg-slate-800/50" />
                    </div>

                    <section>
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500/30" />
                                    <div className="h-5 w-36 rounded-lg bg-slate-800/80" />
                                </div>

                                <div className="mt-2 h-3 w-52 rounded bg-slate-800/40" />
                            </div>

                            <div className="h-7 w-24 rounded-lg bg-slate-800/60" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex min-h-[320px] flex-col justify-between rounded-2xl border border-slate-800 bg-[#111827] p-5"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="h-12 w-12 shrink-0 rounded-xl border border-indigo-500/15 bg-indigo-500/10" />

                                            <div className="h-8 w-8 rounded-lg bg-slate-800/60" />
                                        </div>

                                        <div className="mt-5">
                                            <div className="h-5 w-40 rounded-lg bg-slate-800/80" />

                                            <div className="mt-2 space-y-2">
                                                <div className="h-3 w-full rounded bg-slate-800/40" />
                                                <div className="h-3 w-4/5 rounded bg-slate-800/40" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3.5 w-3.5 rounded bg-indigo-500/10" />
                                                    <div className="h-3 w-14 rounded bg-slate-800/50" />
                                                </div>

                                                <div className="mt-2 h-5 w-8 rounded-md bg-slate-800/80" />
                                            </div>

                                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3.5 w-3.5 rounded bg-indigo-500/10" />
                                                    <div className="h-3 w-14 rounded bg-slate-800/50" />
                                                </div>

                                                <div className="mt-2 h-5 w-8 rounded-md bg-slate-800/80" />
                                            </div>
                                        </div>

                                        <div className="mt-5 h-10 w-full rounded-xl bg-slate-900" />
                                    </div>
                                </div>
                            ))}

                            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/60 p-6 text-center">
                                <div className="h-12 w-12 rounded-xl border border-slate-800 bg-slate-900" />

                                <div className="mt-4 h-4 w-36 rounded bg-slate-800/70" />

                                <div className="mt-2 h-3 w-52 max-w-full rounded bg-slate-800/40" />

                                <div className="mt-1 h-3 w-40 max-w-full rounded bg-slate-800/40" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}