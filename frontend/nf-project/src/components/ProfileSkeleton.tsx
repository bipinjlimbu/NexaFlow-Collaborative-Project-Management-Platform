export default function ProfileSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="h-4 w-20 rounded bg-slate-800" />
                        <div className="h-4 w-2 rounded bg-slate-800" />
                        <div className="h-4 w-14 rounded bg-slate-700" />
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 h-6 w-20 rounded-full bg-indigo-500/10" />
                            <div className="h-10 w-52 rounded-lg bg-slate-800" />
                            <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-800" />
                        </div>

                        <div className="flex gap-3">
                            <div className="h-10 w-20 rounded-xl bg-slate-800" />
                            <div className="h-10 w-32 rounded-xl bg-indigo-500/20" />
                        </div>
                    </div>
                </div>

                <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]">
                    <div className="h-32 bg-[#0F172A]" />

                    <div className="px-5 pb-7 sm:px-7 lg:px-8">
                        <div className="flex flex-col gap-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="h-24 w-24 shrink-0 rounded-2xl border-4 border-[#111827] bg-slate-800" />

                                <div className="min-w-0">
                                    <div className="h-8 w-48 max-w-full rounded-lg bg-slate-800" />
                                    <div className="mt-2 h-4 w-28 rounded bg-slate-800" />
                                </div>
                            </div>

                            <div className="h-7 w-20 rounded-full bg-emerald-500/10" />
                        </div>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]">
                        <div className="border-b border-slate-800 px-5 py-5 sm:px-7">
                            <div className="h-3 w-36 rounded bg-slate-800" />
                            <div className="mt-2 h-6 w-36 rounded bg-slate-800" />
                        </div>

                        <div className="grid sm:grid-cols-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`border-b border-slate-800 p-5 sm:px-7 ${index % 2 === 0
                                        ? "sm:border-r"
                                        : ""
                                        }`}
                                >
                                    <div className="h-3 w-24 rounded bg-slate-800" />
                                    <div className="mt-3 h-4 w-32 rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="h-fit overflow-hidden rounded-3xl border border-rose-500/20 bg-[#111827]">
                        <div className="border-b border-rose-500/10 bg-rose-500/[0.03] px-5 py-5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-rose-500/10" />

                                <div>
                                    <div className="h-3 w-20 rounded bg-rose-500/10" />
                                    <div className="mt-2 h-5 w-28 rounded bg-slate-800" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6">
                            <div className="h-4 w-full rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-4/5 rounded bg-slate-800" />
                            <div className="mt-5 h-10 w-full rounded-xl bg-rose-500/10" />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}