export default function LandingSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white animate-pulse">
            <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col">
                    <section className="flex flex-1 flex-col justify-center py-16 sm:py-20 lg:py-24">
                        <div className="mx-auto w-full max-w-4xl text-center">
                            <div className="mx-auto mb-6 h-7 w-48 rounded-full bg-slate-800/80" />

                            <div className="mx-auto w-full space-y-3">
                                <div className="mx-auto h-12 w-4/5 rounded-2xl bg-slate-800/80 sm:h-14 lg:h-16" />
                                <div className="mx-auto h-12 w-3/5 rounded-2xl bg-slate-800/80 sm:h-14 lg:h-16" />
                            </div>

                            <div className="mx-auto mt-6 w-full max-w-2xl space-y-2">
                                <div className="mx-auto h-4 w-5/6 rounded-md bg-slate-800/60" />
                                <div className="mx-auto h-4 w-4/6 rounded-md bg-slate-800/60" />
                            </div>

                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <div className="h-11 w-full rounded-xl bg-indigo-600/40 sm:w-36" />
                                <div className="h-11 w-full rounded-xl bg-slate-800/80 sm:w-36" />
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-slate-900 py-16">
                        <div className="mb-8 space-y-3">
                            <div className="h-3 w-36 rounded bg-slate-800/60" />
                            <div className="h-8 w-56 rounded-lg bg-slate-800/80" />
                            <div className="h-4 w-full max-w-2xl rounded bg-slate-800/60" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-slate-800/80" />

                                    <div className="mt-5 h-5 w-28 rounded bg-slate-800/80" />

                                    <div className="mt-2 space-y-2">
                                        <div className="h-3 w-full rounded bg-slate-800/60" />
                                        <div className="h-3 w-4/5 rounded bg-slate-800/60" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
                        <div className="w-full max-w-2xl space-y-3">
                            <div className="h-3 w-24 rounded bg-slate-800/60" />
                            <div className="h-7 w-52 rounded-lg bg-slate-800/80" />
                            <div className="h-4 w-full max-w-xl rounded bg-slate-800/60" />
                        </div>

                        <div className="mt-6 h-11 w-40 rounded-xl bg-slate-800/80 lg:mt-0" />
                    </section>
                </div>
            </main>
        </div>
    );
}