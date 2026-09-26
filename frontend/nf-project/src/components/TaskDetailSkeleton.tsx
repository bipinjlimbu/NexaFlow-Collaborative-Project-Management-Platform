export default function TaskDetailSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
                <div className="h-5 w-28 rounded-md bg-slate-800" />

                <div className="mt-7 rounded-3xl border border-slate-800 bg-[#111827] p-5 sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="w-full">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="h-6 w-12 rounded-lg bg-slate-800" />
                                <div className="h-3 w-3 rounded bg-slate-800" />
                                <div className="h-4 w-10 rounded bg-slate-800" />
                                <div className="h-6 w-24 rounded-full bg-slate-800" />
                            </div>

                            <div className="mt-5 h-10 w-3/4 max-w-2xl rounded-xl bg-slate-800 sm:h-12" />

                            <div className="mt-4 space-y-2">
                                <div className="h-4 w-full max-w-3xl rounded bg-slate-800" />
                                <div className="h-4 w-2/3 max-w-2xl rounded bg-slate-800" />
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <div className="h-4 w-32 rounded bg-slate-800" />
                                <div className="h-4 w-40 rounded bg-slate-800" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-800 bg-[#0F172A] p-3">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="h-12 rounded-xl bg-slate-800" />
                        <div className="h-12 rounded-xl bg-slate-800" />
                        <div className="h-12 rounded-xl bg-slate-800" />
                        <div className="h-12 rounded-xl bg-slate-800" />
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
                    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-5 sm:p-7">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                            <div>
                                <div className="h-4 w-32 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-36 rounded bg-slate-800" />
                            </div>
                            <div className="hidden h-9 w-9 rounded-xl bg-slate-800 sm:block" />
                        </div>

                        <div className="grid gap-x-8 gap-y-7 pt-6 sm:grid-cols-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index}>
                                    <div className="h-3 w-20 rounded bg-slate-800" />
                                    <div className="mt-3 h-4 w-32 rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-5 sm:p-7">
                        <div className="border-b border-slate-800 pb-5">
                            <div className="h-4 w-20 rounded bg-slate-800" />
                            <div className="mt-2 h-3 w-28 rounded bg-slate-800" />
                        </div>

                        <div className="mt-7 space-y-7 pl-6">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="relative">
                                    <div className="h-3 w-20 rounded bg-slate-800" />
                                    <div className="mt-3 h-4 w-36 rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}