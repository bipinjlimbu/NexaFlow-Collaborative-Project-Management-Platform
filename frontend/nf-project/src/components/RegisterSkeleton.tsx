export default function RegisterSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#020617] px-4 py-8 text-slate-50 sm:px-6 sm:py-12">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] lg:grid-cols-[0.82fr_1.18fr]">
                    <div className="relative hidden overflow-hidden border-r border-slate-800 bg-[#0F172A] p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-indigo-500/20" />
                                <div className="h-5 w-24 rounded bg-slate-800" />
                            </div>

                            <div className="mt-20 max-w-sm">
                                <div className="h-5 w-24 rounded-full bg-indigo-500/10" />
                                <div className="mt-5 h-10 w-72 rounded-lg bg-slate-800" />
                                <div className="mt-2 h-10 w-64 rounded-lg bg-slate-800" />

                                <div className="mt-6 space-y-2">
                                    <div className="h-4 w-full rounded bg-slate-800" />
                                    <div className="h-4 w-11/12 rounded bg-slate-800" />
                                    <div className="h-4 w-4/5 rounded bg-slate-800" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-5">
                            <div className="h-3 w-72 max-w-full rounded bg-slate-800" />
                            <div className="mt-2 h-3 w-56 max-w-full rounded bg-slate-800" />
                        </div>
                    </div>

                    <div className="p-5 sm:p-7 lg:p-9 xl:p-10">
                        <div className="mb-7 lg:hidden">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-indigo-500/20" />
                                <div className="h-5 w-24 rounded bg-slate-800" />
                            </div>
                        </div>

                        <div className="mb-7">
                            <div className="h-3 w-24 rounded bg-indigo-500/10" />
                            <div className="mt-3 h-8 w-64 rounded-lg bg-slate-800" />
                            <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-800" />
                        </div>

                        <div className="space-y-5">
                            <div>
                                <div className="mb-3 h-3 w-28 rounded bg-slate-800" />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="h-11 rounded-xl bg-[#0F172A]" />
                                    <div className="h-11 rounded-xl bg-[#0F172A]" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-20 rounded bg-slate-800" />
                                <div className="h-11 rounded-xl bg-[#0F172A]" />
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-16 rounded bg-slate-800" />
                                <div className="h-11 rounded-xl bg-[#0F172A]" />
                            </div>

                            <div>
                                <div className="mb-3 h-3 w-20 rounded bg-slate-800" />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="h-11 rounded-xl bg-[#0F172A]" />
                                    <div className="h-11 rounded-xl bg-[#0F172A]" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-3 h-3 w-16 rounded bg-slate-800" />

                                <div className="space-y-4">
                                    <div className="h-11 rounded-xl bg-[#0F172A]" />
                                    <div className="h-11 rounded-xl bg-[#0F172A]" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-32 rounded bg-slate-800" />
                                <div className="h-12 rounded-xl bg-[#0F172A]" />
                            </div>

                            <div className="h-11 rounded-xl bg-indigo-500/20" />

                            <div className="mx-auto h-4 w-48 rounded bg-slate-800" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}