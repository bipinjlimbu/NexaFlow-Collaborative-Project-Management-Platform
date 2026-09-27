export default function LandingSkeleton() {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-50">
            <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col animate-pulse">
                    <section className="relative flex flex-1 items-center py-14 sm:py-20 lg:py-24">
                        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)] lg:gap-16">
                            <div className="max-w-2xl">
                                <div className="mb-7 flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl border border-slate-800 bg-[#111827]" />
                                    <div>
                                        <div className="h-4 w-24 rounded bg-slate-800" />
                                        <div className="mt-2 h-2.5 w-32 rounded bg-slate-900" />
                                    </div>
                                </div>

                                <div className="mb-6 h-7 w-48 rounded-full bg-slate-900" />

                                <div className="h-14 w-full max-w-xl rounded-xl bg-slate-800 sm:h-16" />
                                <div className="mt-3 h-14 w-4/5 max-w-lg rounded-xl bg-slate-800 sm:h-16" />

                                <div className="mt-6 h-5 w-full max-w-xl rounded bg-slate-900" />
                                <div className="mt-2 h-5 w-4/5 max-w-lg rounded bg-slate-900" />

                                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                    <div className="h-12 w-full rounded-xl bg-indigo-500/20 sm:w-40" />
                                    <div className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900 sm:w-40" />
                                </div>

                                <div className="mt-9 flex flex-wrap gap-6">
                                    <div className="h-3 w-20 rounded bg-slate-900" />
                                    <div className="h-3 w-16 rounded bg-slate-900" />
                                    <div className="h-3 w-12 rounded bg-slate-900" />
                                </div>
                            </div>

                            <div className="mx-auto w-full max-w-xl lg:max-w-none">
                                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] p-3 shadow-2xl shadow-black/20">
                                    <div className="flex items-center justify-between border-b border-slate-800 px-3 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-7 w-7 rounded-lg bg-slate-800" />
                                            <div>
                                                <div className="h-2.5 w-20 rounded bg-slate-700" />
                                                <div className="mt-1.5 h-1.5 w-12 rounded bg-slate-800" />
                                            </div>
                                        </div>

                                        <div className="flex gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-slate-700" />
                                            <span className="h-2 w-2 rounded-full bg-slate-700" />
                                            <span className="h-2 w-2 rounded-full bg-slate-700" />
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <div className="aspect-[16/10] w-full rounded-2xl bg-slate-900" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-slate-800/70 py-16 sm:py-20">
                        <div className="mb-9 max-w-2xl">
                            <div className="h-3 w-36 rounded bg-indigo-500/10" />
                            <div className="mt-3 h-8 w-64 rounded bg-slate-800" />
                            <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-900" />
                            <div className="mt-2 h-4 w-4/5 max-w-lg rounded bg-slate-900" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                                <div className="h-11 w-11 rounded-xl bg-indigo-500/10" />
                                <div className="mt-5 h-4 w-24 rounded bg-slate-800" />
                                <div className="mt-3 h-3.5 w-full rounded bg-slate-900" />
                                <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-900" />
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                                <div className="h-11 w-11 rounded-xl bg-indigo-500/10" />
                                <div className="mt-5 h-4 w-20 rounded bg-slate-800" />
                                <div className="mt-3 h-3.5 w-full rounded bg-slate-900" />
                                <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-900" />
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                                <div className="h-11 w-11 rounded-xl bg-indigo-500/10" />
                                <div className="mt-5 h-4 w-16 rounded bg-slate-800" />
                                <div className="mt-3 h-3.5 w-full rounded bg-slate-900" />
                                <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-900" />
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-slate-800/70 py-16 sm:py-20">
                        <div className="mb-10 max-w-2xl">
                            <div className="h-3 w-24 rounded bg-indigo-500/10" />
                            <div className="mt-3 h-8 w-64 rounded bg-slate-800" />
                            <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-900" />
                            <div className="mt-2 h-4 w-4/5 max-w-lg rounded bg-slate-900" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10" />
                                    <div className="h-3 w-20 rounded bg-slate-900" />
                                </div>
                                <div className="mt-6 h-5 w-24 rounded bg-slate-800" />
                                <div className="mt-3 h-3.5 w-full rounded bg-slate-900" />
                                <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-900" />
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10" />
                                    <div className="h-3 w-24 rounded bg-slate-900" />
                                </div>
                                <div className="mt-6 h-5 w-20 rounded bg-slate-800" />
                                <div className="mt-3 h-3.5 w-full rounded bg-slate-900" />
                                <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-900" />
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10" />
                                    <div className="h-3 w-14 rounded bg-slate-900" />
                                </div>
                                <div className="mt-6 h-5 w-16 rounded bg-slate-800" />
                                <div className="mt-3 h-3.5 w-full rounded bg-slate-900" />
                                <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-900" />
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-indigo-500/10 bg-indigo-500/[0.03] p-5 sm:p-6">
                            <div className="h-4 w-48 rounded bg-slate-800" />
                            <div className="mt-2 h-3.5 w-64 rounded bg-slate-900" />
                        </div>
                    </section>

                    <section className="mb-8 rounded-2xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8">
                        <div className="max-w-2xl">
                            <div className="h-3 w-20 rounded bg-indigo-500/10" />
                            <div className="mt-3 h-7 w-64 rounded bg-slate-800" />
                            <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-900" />
                        </div>

                        <div className="mt-7 h-11 w-full rounded-xl bg-indigo-500/10 lg:mt-0 lg:w-36" />
                    </section>
                </div>
            </main>
        </div>
    );
}