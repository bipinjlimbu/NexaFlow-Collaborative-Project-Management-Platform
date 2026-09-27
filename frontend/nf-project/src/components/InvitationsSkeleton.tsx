export default function InvitationsSkeleton() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="mb-7 h-4 w-14 rounded bg-slate-800" />

                <section className="mb-8 rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="h-6 w-32 rounded-full bg-slate-800" />
                            <div className="mt-4 h-9 w-44 rounded-lg bg-slate-800 sm:w-52" />
                            <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-800/80" />
                        </div>

                        <div className="h-10 w-28 rounded-xl bg-slate-800" />
                    </div>
                </section>

                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <article
                            key={item}
                            className="rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6"
                        >
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex min-w-0 gap-4">
                                    <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-800" />

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap gap-2.5">
                                            <div className="h-5 w-44 rounded bg-slate-800" />
                                            <div className="h-6 w-16 rounded-md bg-slate-800" />
                                        </div>

                                        <div className="mt-3 space-y-2">
                                            <div className="h-3 w-full max-w-xl rounded bg-slate-800/80" />
                                            <div className="h-3 w-3/4 max-w-md rounded bg-slate-800/70" />
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-6">
                                            <div className="h-3 w-24 rounded bg-slate-800/70" />
                                            <div className="h-3 w-28 rounded bg-slate-800/70" />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-8 w-20 rounded-lg bg-slate-800" />
                            </div>

                            <div className="mt-5 flex flex-col gap-4 border-t border-slate-800/70 pt-4 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-slate-800" />

                                    <div className="space-y-1.5">
                                        <div className="h-2.5 w-16 rounded bg-slate-800" />
                                        <div className="h-3.5 w-28 rounded bg-slate-800" />
                                    </div>
                                </div>

                                <div className="h-3 w-24 rounded bg-slate-800/70 sm:ml-auto" />
                            </div>

                            <div className="mt-5 flex flex-col gap-2 border-t border-slate-800/70 pt-5 sm:flex-row sm:justify-end">
                                <div className="h-10 w-full rounded-xl bg-slate-800 sm:w-24" />
                                <div className="h-10 w-full rounded-xl bg-slate-800 sm:w-40" />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}