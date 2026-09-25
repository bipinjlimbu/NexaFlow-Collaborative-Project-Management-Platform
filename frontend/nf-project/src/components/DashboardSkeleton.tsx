export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
            <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-1 flex-col space-y-10 px-6 py-12 animate-pulse">
                <section className="flex flex-col justify-between gap-6 border-b border-slate-800 pb-6 md:flex-row md:items-center">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-28 rounded-full bg-slate-800" />
                            <div className="h-4 w-20 rounded-md bg-slate-900" />
                        </div>

                        <div className="h-9 w-72 rounded-xl bg-slate-800" />

                        <div className="h-4 w-80 rounded bg-slate-900" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-36 rounded-xl border border-slate-800 bg-slate-900/60" />
                        <div className="h-10 w-36 rounded-xl bg-slate-800" />
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-3 w-20 rounded bg-slate-800" />
                                    <div className="h-5 w-28 rounded-md bg-slate-800" />
                                    <div className="h-3 w-36 rounded bg-slate-900" />
                                </div>

                                <div className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-800/60" />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="h-3 w-16 rounded bg-slate-800" />
                                <div className="h-3 w-12 rounded bg-slate-900" />
                            </div>
                        </div>
                    ))}
                </section>

                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5"
                        >
                            <div className="h-3 w-28 rounded bg-slate-800" />

                            <div className="mt-3 flex items-baseline justify-between">
                                <div className="h-8 w-12 rounded-lg bg-slate-800" />
                                <div className="h-5 w-16 rounded bg-slate-800/60" />
                            </div>
                        </div>
                    ))}
                </section>

                <section className="grid gap-8 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                                <div className="h-6 w-32 rounded-lg bg-slate-800" />
                            </div>

                            <div className="h-4 w-28 rounded bg-slate-900" />
                        </div>

                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-20 rounded bg-slate-800" />
                                                <div className="h-3 w-12 rounded bg-slate-900" />
                                            </div>

                                            <div className="h-5 w-44 rounded-lg bg-slate-800" />
                                        </div>

                                        <div className="h-6 w-20 rounded-lg bg-slate-800/60" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <div className="h-3 w-14 rounded bg-slate-900" />
                                            <div className="h-3 w-8 rounded bg-slate-900" />
                                        </div>

                                        <div className="h-2 w-full rounded-full bg-slate-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                                <div className="h-6 w-28 rounded-lg bg-slate-800" />
                            </div>

                            <div className="h-4 w-20 rounded bg-slate-900" />
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40">
                            <div className="divide-y divide-slate-800/60">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="space-y-3 p-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-20 rounded bg-slate-800" />
                                            <div className="h-3 w-28 rounded bg-slate-900" />
                                        </div>

                                        <div className="h-4 w-44 rounded bg-slate-800" />

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="h-3 w-20 rounded bg-slate-900" />
                                            <div className="h-6 w-20 rounded-full bg-slate-800/60" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}