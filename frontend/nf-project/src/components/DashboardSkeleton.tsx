export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
            <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1 space-y-10 animate-pulse">
                <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-36 bg-slate-800 rounded-full"></div>
                            <div className="h-4 w-28 bg-slate-900 rounded-md"></div>
                        </div>
                        <div className="h-9 w-64 bg-slate-800 rounded-xl"></div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-32 bg-slate-900 rounded-xl border border-slate-800"></div>
                        <div className="h-10 w-36 bg-slate-800 rounded-xl"></div>
                    </div>
                </section>

                <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
                            <div className="h-3 w-28 bg-slate-800 rounded"></div>
                            <div className="flex items-baseline justify-between pt-1">
                                <div className="h-8 w-12 bg-slate-800 rounded-lg"></div>
                                <div className="h-5 w-16 bg-slate-800 rounded"></div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="h-6 w-36 bg-slate-800 rounded-lg"></div>
                            <div className="h-4 w-24 bg-slate-900 rounded"></div>
                        </div>

                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="h-3 w-32 bg-slate-800 rounded"></div>
                                            <div className="h-5 w-48 bg-slate-800 rounded-lg"></div>
                                        </div>
                                        <div className="h-6 w-20 bg-slate-800 rounded-lg"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <div className="h-3 w-12 bg-slate-900 rounded"></div>
                                            <div className="h-3 w-8 bg-slate-900 rounded"></div>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="h-6 w-40 bg-slate-800 rounded-lg"></div>
                            <div className="h-3 w-20 bg-slate-900 rounded"></div>
                        </div>

                        <div className="p-1 bg-slate-900 rounded-2xl border border-slate-800">
                            <div className="bg-slate-950 p-5 rounded-[14px] space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-800"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-800"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-800"></div>
                                    </div>
                                    <div className="h-3 w-24 bg-slate-900 rounded"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 w-28 bg-slate-800 rounded"></div>
                                    <div className="pl-4 border-l border-slate-800 space-y-2">
                                        <div className="h-3 w-20 bg-slate-800 rounded"></div>
                                        <div className="h-3 w-36 bg-slate-900 rounded"></div>
                                        <div className="h-3 w-32 bg-slate-900 rounded"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-slate-800 rounded pt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-44 bg-slate-800 rounded-lg"></div>
                        <div className="h-4 w-20 bg-slate-900 rounded"></div>
                    </div>

                    <div className="p-1 bg-slate-900 rounded-2xl border border-slate-800">
                        <div className="bg-slate-950 p-4 sm:p-6 rounded-[14px] divide-y divide-slate-800/60">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-2">
                                        <div className="h-3 w-32 bg-slate-900 rounded"></div>
                                        <div className="h-4 w-48 bg-slate-800 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-3 w-16 bg-slate-900 rounded"></div>
                                        <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}