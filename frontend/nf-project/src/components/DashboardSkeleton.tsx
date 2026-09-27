export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-50">
            <main className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A]">
                    <div className="flex flex-col gap-7 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-8">
                        <div className="max-w-2xl">
                            <div className="h-7 w-28 rounded-full bg-indigo-500/10" />
                            <div className="mt-5 h-10 w-full max-w-md rounded-lg bg-slate-800 sm:h-11" />
                            <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-900" />
                            <div className="mt-2 h-4 w-4/5 max-w-lg rounded bg-slate-900" />
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <div className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900 sm:w-36" />
                            <div className="h-11 w-full rounded-xl bg-indigo-500/10 sm:w-36" />
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="h-10 w-10 rounded-xl bg-slate-800" />
                                    <div className="mt-5 h-4 w-24 rounded bg-slate-800" />
                                    <div className="mt-2 h-3 w-40 rounded bg-slate-900" />
                                </div>

                                <div className="h-4 w-4 rounded bg-slate-800" />
                            </div>

                            <div className="mt-5 border-t border-slate-800/70 pt-4">
                                <div className="h-3 w-20 rounded bg-slate-900" />
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="h-3 w-24 rounded bg-slate-800" />
                                <div className="h-2 w-2 rounded-full bg-slate-800" />
                            </div>

                            <div className="mt-4 h-9 w-16 rounded bg-slate-800" />
                            <div className="mt-2 h-3 w-28 rounded bg-slate-900" />

                            {item === 4 && (
                                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800" />
                            )}
                        </div>
                    ))}
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="min-w-0 lg:col-span-2">
                        <div className="mb-5 flex items-end justify-between">
                            <div>
                                <div className="h-5 w-32 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-48 rounded bg-slate-900" />
                            </div>

                            <div className="h-3 w-12 rounded bg-slate-900" />
                        </div>

                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <div className="h-3 w-32 rounded bg-indigo-500/10" />
                                            <div className="mt-2 h-4 w-48 rounded bg-slate-800" />
                                        </div>

                                        <div className="h-7 w-24 rounded-lg bg-slate-900" />
                                    </div>

                                    <div className="mt-5 flex items-center justify-between">
                                        <div className="h-3 w-12 rounded bg-slate-900" />
                                        <div className="h-3 w-8 rounded bg-slate-800" />
                                    </div>

                                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="mb-5 flex items-end justify-between">
                            <div>
                                <div className="h-5 w-28 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-40 rounded bg-slate-900" />
                            </div>

                            <div className="h-3 w-12 rounded bg-slate-900" />
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                            <div className="divide-y divide-slate-800/70">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div
                                        key={item}
                                        className="p-4 sm:p-5"
                                    >
                                        <div className="h-3 w-40 rounded bg-slate-900" />
                                        <div className="mt-2 h-4 w-3/4 rounded bg-slate-800" />

                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            <div className="h-3 w-20 rounded bg-slate-900" />
                                            <div className="h-5 w-20 rounded-full bg-slate-800" />
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