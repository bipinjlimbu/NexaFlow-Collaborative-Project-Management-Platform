export default function WorkspacesSkeleton() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 animate-pulse">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end pb-6 border-b border-slate-800/80">
                    <div className="space-y-3">
                        <div className="h-6 w-32 rounded-md bg-slate-800/80" />
                        <div className="h-9 w-48 rounded-lg bg-slate-800/80" />
                        <div className="h-4 w-96 max-w-full rounded bg-slate-800/60" />
                    </div>
                    <div className="h-11 w-44 rounded-xl bg-slate-800/80" />
                </div>

                <div className="mb-8 h-11 w-full rounded-xl border border-slate-800/80 bg-slate-900/60" />

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-5 w-36 rounded bg-slate-800/80" />
                            <div className="h-4 w-56 rounded bg-slate-800/60" />
                        </div>
                        <div className="h-7 w-28 rounded-lg bg-slate-900 border border-slate-800" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex min-h-[320px] flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6"
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="h-12 w-12 rounded-xl bg-slate-800/80" />
                                        <div className="h-8 w-8 rounded-lg bg-slate-800/60" />
                                    </div>

                                    <div className="mt-5 space-y-3">
                                        <div className="h-5 w-36 rounded bg-slate-800/80" />
                                        <div className="h-4 w-full rounded bg-slate-800/60" />
                                        <div className="h-4 w-3/4 rounded bg-slate-800/60" />
                                    </div>
                                </div>

                                <div>
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <div className="h-16 rounded-xl bg-slate-950/60 border border-slate-800/60" />
                                        <div className="h-16 rounded-xl bg-slate-950/60 border border-slate-800/60" />
                                    </div>
                                    <div className="mt-5 h-10 w-full rounded-xl bg-slate-800/80" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-12">
                    <div className="mb-4 space-y-2">
                        <div className="h-5 w-36 rounded bg-slate-800/80" />
                        <div className="h-4 w-48 rounded bg-slate-800/60" />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 divide-y divide-slate-800/60">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-800/80" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 rounded bg-slate-800/80" />
                                    <div className="h-3 w-24 rounded bg-slate-800/60" />
                                </div>
                                <div className="h-4 w-4 rounded bg-slate-800/60" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}