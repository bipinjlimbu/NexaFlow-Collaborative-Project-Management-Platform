export default function ProjectDetailSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="mb-6 h-10 w-36 rounded-xl bg-[#111827]" />

                <section className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8">
                    <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                        <div className="w-full max-w-3xl">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-indigo-500/10" />

                                <div className="min-w-0 flex-1">
                                    <div className="h-3 w-24 rounded bg-slate-800" />
                                    <div className="mt-2 h-9 w-64 max-w-full rounded bg-slate-800 sm:h-10" />
                                </div>
                            </div>

                            <div className="mt-5 h-4 w-full max-w-2xl rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-4/5 max-w-xl rounded bg-slate-800" />

                            <div className="mt-5 flex gap-2">
                                <div className="h-7 w-20 rounded-full bg-slate-800" />
                                <div className="h-7 w-28 rounded-full bg-slate-800" />
                            </div>
                        </div>

                        <div className="flex w-full gap-2 sm:w-auto">
                            <div className="h-10 flex-1 rounded-xl bg-slate-800 sm:w-20 sm:flex-none" />
                            <div className="h-10 flex-1 rounded-xl bg-slate-800 sm:w-24 sm:flex-none" />
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
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/10" />

                                <div>
                                    <div className="h-3 w-16 rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-24 rounded bg-slate-800" />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-20 rounded bg-slate-800" />
                                <div className="h-5 w-7 rounded bg-slate-800" />
                            </div>

                            <div className="mt-2 h-4 w-52 rounded bg-slate-800" />
                        </div>

                        <div className="h-10 w-full rounded-xl bg-slate-800 sm:w-28" />
                    </div>

                    <div className="mt-5 space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-xl border border-slate-800 bg-[#0F172A] p-4 sm:p-5"
                            >
                                <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            <div className="h-5 w-40 rounded bg-slate-800" />
                                            <div className="h-5 w-20 rounded-full bg-slate-800" />
                                            <div className="h-5 w-16 rounded-full bg-slate-800" />
                                        </div>

                                        <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-800" />
                                        <div className="mt-2 h-4 w-3/5 max-w-md rounded bg-slate-800" />
                                    </div>

                                    <div className="lg:min-w-28">
                                        <div className="h-3 w-16 rounded bg-slate-800 lg:ml-auto" />
                                        <div className="mt-2 h-4 w-24 rounded bg-slate-800 lg:ml-auto" />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-800 pt-4 sm:grid-cols-3">
                                    {[1, 2, 3].map((field) => (
                                        <div key={field}>
                                            <div className="h-3 w-16 rounded bg-slate-800" />
                                            <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                        <div className="h-6 w-32 rounded bg-slate-800" />

                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item}>
                                    <div className="h-3 w-20 rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-28 rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                        <div className="h-6 w-24 rounded bg-slate-800" />

                        <div className="mt-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-500/10" />

                            <div>
                                <div className="h-4 w-32 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-36 rounded bg-slate-800" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-36 rounded bg-slate-800" />
                                <div className="h-5 w-7 rounded bg-slate-800" />
                            </div>

                            <div className="mt-2 h-4 w-24 rounded bg-slate-800" />
                        </div>

                        <div className="h-10 w-full rounded-xl bg-slate-800 sm:w-32" />
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0F172A] p-4"
                            >
                                <div className="h-11 w-11 shrink-0 rounded-full bg-indigo-500/10" />

                                <div className="min-w-0 flex-1">
                                    <div className="h-4 w-32 rounded bg-slate-800" />
                                    <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
                                    <div className="mt-2 h-3 w-36 rounded bg-slate-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}