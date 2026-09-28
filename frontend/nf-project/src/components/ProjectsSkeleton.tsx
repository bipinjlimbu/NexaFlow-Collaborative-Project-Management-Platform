export default function ProjectsSkeleton() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A]">
                    <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-500/5 blur-3xl" />

                    <div className="relative flex flex-col gap-7 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
                        <div className="flex items-start gap-4">
                            <div className="hidden h-12 w-12 shrink-0 rounded-2xl bg-slate-800/80 sm:block" />

                            <div className="w-full">
                                <div className="h-7 w-32 animate-pulse rounded-full bg-slate-800" />

                                <div className="mt-4 h-10 w-48 animate-pulse rounded-lg bg-slate-800 sm:h-11 sm:w-56" />

                                <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-800/80" />
                                <div className="mt-2 h-4 w-4/5 max-w-lg animate-pulse rounded bg-slate-800/60" />
                            </div>
                        </div>

                        <div className="h-11 w-full animate-pulse rounded-xl bg-slate-800 sm:w-40" />
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0F172A] p-4 sm:p-5">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="h-11 flex-1 animate-pulse rounded-xl bg-[#020617]" />
                        <div className="h-11 w-full animate-pulse rounded-xl bg-[#020617] sm:w-48" />
                    </div>
                </section>

                <section className="mt-8">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="h-5 w-36 animate-pulse rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-800/70" />
                        </div>

                        <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-800" />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="flex min-h-[345px] flex-col rounded-2xl border border-slate-800 bg-[#111827] p-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-800" />
                                        <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-800" />
                                    </div>

                                    <div className="mt-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="h-5 w-32 animate-pulse rounded bg-slate-800" />
                                            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-800" />
                                        </div>

                                        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-800/80" />
                                        <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-800/60" />

                                        <div className="mt-5 h-4 w-28 animate-pulse rounded bg-slate-800/60" />
                                    </div>

                                    <div className="mt-auto pt-6">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="h-24 animate-pulse rounded-xl border border-slate-800 bg-[#0F172A]" />
                                            <div className="h-24 animate-pulse rounded-xl border border-slate-800 bg-[#0F172A]" />
                                        </div>

                                        <div className="mt-3 h-10 animate-pulse rounded-xl border border-slate-800 bg-[#0F172A]" />

                                        <div className="mt-4 h-10 animate-pulse rounded-xl border border-slate-800 bg-[#0F172A]" />
                                    </div>
                                </div>
                            )
                        )}

                        <div className="flex min-h-[345px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/40 p-6">
                            <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-800" />

                            <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-800" />

                            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-800/60" />
                            <div className="mt-2 h-3 w-36 animate-pulse rounded bg-slate-800/50" />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}