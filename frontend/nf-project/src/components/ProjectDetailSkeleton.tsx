export default function ProjectDetailSkeleton() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-10 animate-pulse">
                <div className="mb-8 h-5 w-36 rounded bg-slate-800" />

                <div className="mb-8 border-b border-slate-800/80 pb-8">
                    <div className="mb-4 h-12 w-12 rounded-xl bg-slate-800" />
                    <div className="h-10 w-72 rounded bg-slate-800" />
                    <div className="mt-4 h-4 w-full max-w-2xl rounded bg-slate-800" />
                    <div className="mt-2 h-4 w-full max-w-xl rounded bg-slate-800" />

                    <div className="mt-5 flex gap-3">
                        <div className="h-7 w-20 rounded-full bg-slate-800" />
                        <div className="h-7 w-28 rounded-full bg-slate-800" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-slate-800" />

                                <div className="flex-1">
                                    <div className="h-3 w-16 rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-20 rounded bg-slate-800" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="h-5 w-16 rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-48 rounded bg-slate-800" />
                        </div>

                        <div className="h-10 w-28 rounded-xl bg-slate-800" />
                    </div>

                    <div className="mt-5 rounded-xl border border-dashed border-slate-800 p-8">
                        <div className="mx-auto h-12 w-12 rounded-xl bg-slate-800" />
                        <div className="mx-auto mt-4 h-4 w-24 rounded bg-slate-800" />
                        <div className="mx-auto mt-2 h-4 w-72 max-w-full rounded bg-slate-800" />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
                        <div className="h-5 w-32 rounded bg-slate-800" />

                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item}>
                                    <div className="h-3 w-24 rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-28 rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
                        <div className="h-5 w-24 rounded bg-slate-800" />

                        <div className="mt-5 flex items-center gap-4">
                            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-800" />

                            <div className="flex-1">
                                <div className="h-4 w-32 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-40 rounded bg-slate-800" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-5 w-36 rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-24 rounded bg-slate-800" />
                        </div>

                        <div className="h-5 w-5 rounded bg-slate-800" />
                    </div>

                    <div className="mt-5 rounded-xl border border-dashed border-slate-800 p-6">
                        <div className="h-4 w-40 rounded bg-slate-800" />
                    </div>
                </div>
            </div>
        </main>
    );
}