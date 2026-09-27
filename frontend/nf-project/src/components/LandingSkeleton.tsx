export default function LandingSkeleton() {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-50">
            <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col">
                    <section className="relative flex flex-1 items-center justify-center py-16 sm:py-20 lg:py-24">
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/[0.05] blur-3xl" />
                            <div className="absolute bottom-10 left-1/4 h-40 w-40 rounded-full bg-indigo-500/[0.03] blur-3xl" />
                        </div>

                        <div className="relative mx-auto w-full max-w-4xl animate-pulse text-center">
                            <div className="mx-auto h-7 w-48 rounded-full bg-slate-800" />

                            <div className="mx-auto mt-7 h-12 w-full max-w-2xl rounded-xl bg-slate-800 sm:h-14 md:h-16 lg:h-20" />
                            <div className="mx-auto mt-3 h-12 w-72 max-w-full rounded-xl bg-indigo-500/20 sm:h-14 md:h-16 lg:h-20" />

                            <div className="mx-auto mt-7 h-5 w-full max-w-2xl rounded-lg bg-slate-800" />
                            <div className="mx-auto mt-2 h-5 w-4/5 max-w-xl rounded-lg bg-slate-800" />

                            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                                <div className="h-12 rounded-xl bg-indigo-500/30 sm:w-40" />
                                <div className="h-12 rounded-xl bg-slate-800 sm:w-32" />
                            </div>

                            <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3">
                                <div className="h-4 w-20 rounded bg-slate-800" />
                                <div className="h-4 w-16 rounded bg-slate-800" />
                                <div className="h-4 w-12 rounded bg-slate-800" />
                            </div>
                        </div>
                    </section>

                    <section
                        id="features"
                        className="border-t border-slate-800/70 py-16 sm:py-20"
                    >
                        <div className="mb-9 max-w-2xl animate-pulse">
                            <div className="h-3 w-36 rounded bg-indigo-500/20" />
                            <div className="mt-4 h-8 w-64 rounded-lg bg-slate-800" />
                            <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-800" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-2xl border border-slate-800 bg-[#111827] p-6"
                                >
                                    <div className="h-11 w-11 rounded-xl bg-indigo-500/15" />
                                    <div className="mt-5 h-5 w-28 rounded bg-slate-800" />
                                    <div className="mt-3 h-4 w-full rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-4/5 rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="border-t border-slate-800/70 py-16 sm:py-20">
                        <div className="mb-10 max-w-2xl animate-pulse">
                            <div className="h-3 w-24 rounded bg-indigo-500/20" />
                            <div className="mt-4 h-8 w-60 rounded-lg bg-slate-800" />
                            <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-800" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-2xl border border-slate-800 bg-[#111827] p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-500/15" />
                                        <div className="h-3 w-20 rounded bg-slate-800" />
                                    </div>

                                    <div className="mt-6 h-5 w-24 rounded bg-slate-800" />
                                    <div className="mt-3 h-4 w-full rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-4/5 rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 animate-pulse rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.04] p-5 sm:p-6">
                            <div className="h-5 w-52 rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-800" />
                        </div>
                    </section>

                    <section className="mb-8 animate-pulse rounded-2xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8">
                        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                            <div className="w-full max-w-2xl">
                                <div className="h-3 w-20 rounded bg-indigo-500/20" />
                                <div className="mt-4 h-8 w-64 rounded-lg bg-slate-800" />
                                <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-800" />
                            </div>

                            <div className="h-11 w-full rounded-xl bg-indigo-500/25 sm:w-36" />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}