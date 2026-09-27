export default function NotificationsSkeleton() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="mb-7 h-4 w-14 rounded bg-slate-800" />

                <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-2xl shadow-black/20">
                    <div className="border-b border-slate-800 px-5 py-6 sm:px-7 sm:py-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="h-6 w-20 rounded-full bg-slate-800" />

                                <div className="mt-4 h-9 w-48 rounded-lg bg-slate-800 sm:w-56" />

                                <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-800/80" />
                            </div>

                            <div className="h-10 w-24 rounded-xl bg-slate-800" />
                        </div>
                    </div>

                    <div className="divide-y divide-slate-800/70">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-4 px-5 py-5 sm:gap-5 sm:px-7"
                            >
                                <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-800 sm:h-12 sm:w-12" />

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="h-4 w-48 rounded bg-slate-800" />
                                        <div className="h-3 w-14 rounded bg-slate-800/70" />
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="h-3 w-full max-w-2xl rounded bg-slate-800/80" />
                                        <div className="h-3 w-4/5 max-w-xl rounded bg-slate-800/70" />
                                    </div>

                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="h-6 w-20 rounded-md bg-slate-800" />

                                        <div className="flex items-center gap-4">
                                            <div className="h-3 w-10 rounded bg-slate-800/70" />
                                            <div className="h-3 w-12 rounded bg-slate-800/70" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}