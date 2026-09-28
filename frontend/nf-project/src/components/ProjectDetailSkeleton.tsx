export default function ProjectDetailSkeleton() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="mb-6 h-10 w-36 animate-pulse rounded-xl bg-[#111827]" />

                <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A]">
                    <div className="p-5 sm:p-7 lg:p-8">
                        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex min-w-0 gap-4">
                                <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-slate-800" />

                                <div className="min-w-0 flex-1">
                                    <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                                    <div className="mt-3 h-9 w-64 max-w-full animate-pulse rounded-lg bg-slate-800 sm:h-10 sm:w-80" />

                                    <div className="mt-5 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-800/80" />
                                    <div className="mt-2 h-4 w-4/5 max-w-xl animate-pulse rounded bg-slate-800/60" />

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <div className="h-7 w-20 animate-pulse rounded-full bg-slate-800" />
                                        <div className="h-7 w-28 animate-pulse rounded-full bg-slate-800" />
                                        <div className="h-7 w-36 animate-pulse rounded-full bg-slate-800" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full gap-2 sm:w-auto">
                                <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-800 sm:w-28 sm:flex-none" />
                                <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-800 sm:w-24 sm:flex-none" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-800" />

                                <div className="min-w-0 flex-1">
                                    <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-800/80" />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-800" />
                                <div className="h-5 w-20 animate-pulse rounded bg-slate-800" />
                                <div className="h-6 w-8 animate-pulse rounded-md bg-slate-800" />
                            </div>

                            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-800/60" />
                        </div>

                        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-800 sm:w-28" />
                    </div>

                    <div className="mt-6 space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-xl border border-slate-800 bg-[#0F172A] p-4 sm:p-5"
                            >
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            <div className="h-4 w-36 animate-pulse rounded bg-slate-800" />
                                            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-800" />
                                            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-800" />
                                        </div>

                                        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-800/70" />
                                        <div className="mt-2 h-4 w-3/5 animate-pulse rounded bg-slate-800/50" />
                                    </div>

                                    <div className="h-10 w-24 animate-pulse rounded bg-slate-800/70" />
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-800 pt-4 sm:grid-cols-3">
                                    <div>
                                        <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
                                        <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-800/60" />
                                    </div>

                                    <div>
                                        <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
                                        <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-800/60" />
                                    </div>

                                    <div>
                                        <div className="h-3 w-16 animate-pulse rounded bg-slate-800" />
                                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-800/60" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-800" />

                                <div>
                                    <div className="h-5 w-32 animate-pulse rounded bg-slate-800" />
                                    <div className="mt-2 h-3 w-44 animate-pulse rounded bg-slate-800/60" />
                                </div>
                            </div>

                            {item === 1 ? (
                                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {[1, 2, 3, 4, 5, 6].map(
                                        (field) => (
                                            <div key={field}>
                                                <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
                                                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-800/70" />
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="h-12 w-12 animate-pulse rounded-full bg-slate-800" />

                                    <div className="min-w-0 flex-1">
                                        <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
                                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-800/60" />
                                        <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-800/50" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-800" />
                                <div className="h-5 w-36 animate-pulse rounded bg-slate-800" />
                                <div className="h-6 w-8 animate-pulse rounded-md bg-slate-800" />
                            </div>

                            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-800/60" />
                        </div>

                        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-800 sm:w-28" />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0F172A] p-4"
                            >
                                <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-800" />

                                <div className="min-w-0 flex-1">
                                    <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
                                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-800/60" />
                                    <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-800/50" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}