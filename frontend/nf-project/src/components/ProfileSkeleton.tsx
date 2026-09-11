export default function ProfileSkeleton() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="mb-8">
                    <div className="mb-2 h-4 w-32 animate-pulse rounded bg-slate-800" />

                    <div className="h-9 w-32 animate-pulse rounded bg-slate-800" />

                    <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-800" />
                </div>

                <section className="mb-6 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="h-28 animate-pulse bg-slate-800/60" />

                    <div className="px-6 pb-6">
                        <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end">
                                <div className="h-24 w-24 animate-pulse rounded-2xl border-4 border-slate-950 bg-slate-800" />

                                <div className="pb-1">
                                    <div className="h-7 w-48 animate-pulse rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-800" />
                                </div>
                            </div>

                            <div className="h-4 w-14 animate-pulse rounded bg-slate-800" />
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 lg:col-span-2">
                        <div className="border-b border-slate-800/80 px-6 py-5">
                            <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
                            <div className="mt-2 h-6 w-36 animate-pulse rounded bg-slate-800" />
                        </div>

                        <div className="grid gap-px bg-slate-800/60 sm:grid-cols-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`bg - slate - 900 / 60 p - 6 ${index === 5 ? "sm:col-span-2" : ""
                                        } `}
                                >
                                    <div className="mb-3 h-3 w-24 animate-pulse rounded bg-slate-800" />
                                    <div className="h-4 w-40 animate-pulse rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-6">
                        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40">
                            <div className="border-b border-slate-800/80 px-6 py-5">
                                <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
                                <div className="mt-2 h-6 w-24 animate-pulse rounded bg-slate-800" />
                            </div>

                            <div className="divide-y divide-slate-800/80">
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between px-6 py-5"
                                    >
                                        <div>
                                            <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
                                            <div className="mt-2 h-3 w-44 animate-pulse rounded bg-slate-800" />
                                        </div>

                                        <div className="h-5 w-5 animate-pulse rounded bg-slate-800" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40">
                            <div className="border-b border-slate-800/80 px-6 py-5">
                                <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                                <div className="mt-2 h-6 w-28 animate-pulse rounded bg-slate-800" />
                            </div>

                            <div className="divide-y divide-slate-800/80">
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between px-6 py-5"
                                    >
                                        <div>
                                            <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
                                            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-800" />
                                        </div>

                                        <div className="h-5 w-9 animate-pulse rounded-full bg-slate-800" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="border-b border-slate-800/80 px-6 py-5">
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                        <div className="mt-2 h-6 w-32 animate-pulse rounded bg-slate-800" />
                    </div>

                    <div className="grid gap-px bg-slate-800/60 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-slate-900/60 p-6">
                                <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
                                <div className="mt-3 h-8 w-12 animate-pulse rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-800" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}