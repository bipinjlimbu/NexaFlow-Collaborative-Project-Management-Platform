export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#020617] text-[#F8FAFC] selection:bg-indigo-500 selection:text-white">
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <div className="animate-pulse">
                    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] px-5 py-6 shadow-2xl shadow-black/10 sm:px-7 sm:py-7 lg:px-8">
                        <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-indigo-500/[0.06] blur-3xl" />

                        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <div className="max-w-2xl space-y-3">
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="h-7 w-24 rounded-full bg-indigo-500/10" />
                                    <div className="h-3 w-20 rounded bg-slate-800/50" />
                                </div>

                                <div className="h-9 w-72 max-w-full rounded-xl bg-slate-800/80" />

                                <div className="h-4 w-full max-w-xl rounded bg-slate-800/50" />
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <div className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900/70 sm:w-36" />
                                <div className="h-11 w-full rounded-xl bg-indigo-500/20 sm:w-36" />
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="h-3 w-20 rounded bg-slate-800" />
                                        <div className="mt-2 h-5 w-28 rounded-md bg-slate-800/80" />
                                        <div className="mt-2 h-3 w-36 rounded bg-slate-800/50" />
                                    </div>

                                    <div className="h-10 w-10 shrink-0 rounded-xl border border-indigo-500/20 bg-indigo-500/10" />
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-4">
                                    <div className="h-3 w-16 rounded bg-slate-800/60" />
                                    <div className="h-3 w-12 rounded bg-slate-800/40" />
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="h-3 w-28 rounded bg-slate-800" />
                                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                                </div>

                                <div className="mt-4 flex items-end justify-between gap-4">
                                    <div className="h-9 w-14 rounded-lg bg-slate-800/80" />
                                    <div className="h-6 w-16 rounded-lg bg-slate-800/50" />
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="mt-8 grid gap-6 lg:grid-cols-3">
                        <div className="min-w-0 space-y-5 lg:col-span-2">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500/40" />
                                        <div className="h-5 w-32 rounded-lg bg-slate-800/80" />
                                    </div>

                                    <div className="mt-2 h-3 w-56 rounded bg-slate-800/40" />
                                </div>

                                <div className="h-3 w-14 rounded bg-slate-800/50" />
                            </div>

                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-24 rounded bg-indigo-500/10" />
                                                    <div className="h-3 w-2 rounded bg-slate-800/60" />
                                                    <div className="h-3 w-20 rounded bg-slate-800/40" />
                                                </div>

                                                <div className="h-5 w-48 max-w-full rounded-lg bg-slate-800/80" />
                                            </div>

                                            <div className="h-7 w-24 shrink-0 rounded-lg bg-slate-900" />
                                        </div>

                                        <div className="mt-5 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="h-3 w-14 rounded bg-slate-800/50" />
                                                <div className="h-3 w-8 rounded bg-slate-800/60" />
                                            </div>

                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                                <div className="h-full w-1/3 rounded-full bg-indigo-500/20" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="min-w-0 space-y-5">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-sky-500/40" />
                                        <div className="h-5 w-28 rounded-lg bg-slate-800/80" />
                                    </div>

                                    <div className="mt-2 h-3 w-44 rounded bg-slate-800/40" />
                                </div>

                                <div className="h-3 w-14 rounded bg-slate-800/50" />
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                                <div className="divide-y divide-slate-800/70">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="p-4 sm:p-5"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <div className="h-3 w-20 rounded bg-indigo-500/10" />
                                                    <div className="h-2 w-2 rounded-full bg-slate-800/60" />
                                                    <div className="h-3 w-24 rounded bg-slate-800/40" />
                                                </div>

                                                <div className="mt-2 h-4 w-40 max-w-full rounded bg-slate-800/80" />

                                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                    <div className="h-3 w-24 rounded bg-slate-800/40" />
                                                    <div className="h-6 w-20 rounded-full bg-slate-800/60" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}