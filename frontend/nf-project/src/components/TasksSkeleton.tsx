"use client";

export default function TasksSkeleton() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-10 animate-pulse">
                <header className="mb-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-5 w-28 rounded bg-slate-800" />
                                <span className="text-xs text-slate-600">/</span>
                                <div className="h-4 w-16 rounded bg-slate-800" />
                            </div>
                            <div className="h-8 w-32 rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-80 rounded bg-slate-800" />
                        </div>
                        <div className="h-11 w-32 rounded-lg bg-slate-800" />
                    </div>
                </header>

                <section className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                            <div className="h-3 w-20 rounded bg-slate-800" />
                            <div className="mt-3 h-8 w-12 rounded bg-slate-800" />
                        </div>
                    ))}
                </section>

                <section className="mb-8 rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
                    <div className="flex flex-col gap-3 xl:flex-row">
                        <div className="h-11 flex-1 rounded-lg bg-slate-800" />
                        <div className="h-11 w-36 rounded-lg bg-slate-800" />
                        <div className="h-11 w-36 rounded-lg bg-slate-800" />
                        <div className="h-11 w-36 rounded-lg bg-slate-800" />
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30">
                    <div className="divide-y divide-slate-800/80">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded-md bg-slate-800" />
                                    <div>
                                        <div className="h-4 w-48 rounded bg-slate-800" />
                                        <div className="mt-2 h-3 w-32 rounded bg-slate-800" />
                                    </div>
                                </div>
                                <div className="hidden h-4 w-24 rounded bg-slate-800 lg:block" />
                                <div className="h-6 w-20 rounded-full bg-slate-800" />
                                <div className="h-4 w-16 rounded bg-slate-800" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}