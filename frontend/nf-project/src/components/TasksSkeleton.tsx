"use client";

export default function TasksSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <header className="mb-8">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="h-6 w-28 rounded-lg bg-indigo-500/10" />
                        <div className="h-3 w-2 rounded bg-slate-800" />
                        <div className="h-3 w-16 rounded bg-slate-800" />
                    </div>

                    <div className="h-10 w-28 rounded-lg bg-slate-800" />

                    <div className="mt-3 h-5 w-full max-w-2xl rounded bg-slate-900" />
                    <div className="mt-2 h-5 w-2/3 max-w-lg rounded bg-slate-900" />
                </header>

                <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="h-3 w-16 rounded bg-slate-800" />

                                <div className="h-8 w-8 rounded-lg bg-slate-800" />
                            </div>

                            <div className="mt-4 h-8 w-10 rounded bg-slate-800" />
                            <div className="mt-2 h-3 w-20 rounded bg-slate-900" />
                        </div>
                    ))}
                </section>

                <section className="mb-8 rounded-2xl border border-slate-800 bg-[#111827] p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2 px-1">
                        <div className="h-7 w-7 rounded-lg bg-indigo-500/10" />

                        <div>
                            <div className="h-3 w-20 rounded bg-slate-800" />
                            <div className="mt-1.5 hidden h-2.5 w-40 rounded bg-slate-900 sm:block" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
                        <div className="h-11 rounded-xl border border-slate-800 bg-[#020617]" />

                        <div className="h-11 rounded-xl border border-slate-800 bg-[#020617]" />

                        <div className="h-11 rounded-xl border border-slate-800 bg-[#020617]" />

                        <div className="h-11 rounded-xl border border-slate-800 bg-[#020617]" />
                    </div>
                </section>

                <section>
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="h-6 w-24 rounded bg-slate-800" />
                            <div className="mt-2 h-3 w-48 rounded bg-slate-900" />
                        </div>

                        <div className="h-7 w-20 rounded-lg bg-slate-800" />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                        <div className="hidden border-b border-slate-800 bg-[#0F172A]/70 px-5 py-3 lg:grid lg:grid-cols-[minmax(280px,1.8fr)_minmax(140px,1fr)_130px_110px_120px] lg:gap-5 xl:px-6">
                            <div className="h-3 w-12 rounded bg-slate-800" />
                            <div className="h-3 w-16 rounded bg-slate-800" />
                            <div className="h-3 w-14 rounded bg-slate-800" />
                            <div className="h-3 w-16 rounded bg-slate-800" />
                            <div className="h-3 w-10 rounded bg-slate-800" />
                        </div>

                        <div className="divide-y divide-slate-800">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-5 sm:px-5 lg:px-5 xl:px-6"
                                >
                                    <div className="grid gap-4 lg:grid-cols-[minmax(280px,1.8fr)_minmax(140px,1fr)_130px_110px_120px] lg:items-center lg:gap-5">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-800" />

                                            <div className="min-w-0 flex-1">
                                                <div className="h-4 w-2/3 rounded bg-slate-800" />
                                                <div className="mt-2 h-3 w-full max-w-sm rounded bg-slate-900" />

                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-slate-800" />
                                                    <div className="h-3 w-20 rounded bg-slate-900" />
                                                    <div className="h-2 w-2 rounded-full bg-slate-800" />
                                                    <div className="h-3 w-24 rounded bg-slate-900" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between lg:block">
                                            <div className="h-3 w-12 rounded bg-slate-900 lg:hidden" />
                                            <div className="h-3 w-24 rounded bg-slate-800" />
                                        </div>

                                        <div className="flex items-center justify-between lg:block">
                                            <div className="h-3 w-12 rounded bg-slate-900 lg:hidden" />
                                            <div className="h-6 w-20 rounded-full bg-slate-800" />
                                        </div>

                                        <div className="flex items-center justify-between lg:block">
                                            <div className="h-3 w-12 rounded bg-slate-900 lg:hidden" />
                                            <div className="h-3 w-16 rounded bg-slate-800" />
                                        </div>

                                        <div className="flex items-center justify-between lg:block">
                                            <div className="h-3 w-12 rounded bg-slate-900 lg:hidden" />

                                            <div>
                                                <div className="h-3 w-16 rounded bg-slate-800" />
                                                <div className="mt-1.5 h-2.5 w-24 rounded bg-slate-900" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}