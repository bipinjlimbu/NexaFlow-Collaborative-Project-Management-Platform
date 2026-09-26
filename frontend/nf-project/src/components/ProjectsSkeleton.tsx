export default function ProjectsSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] px-5 py-6 sm:px-7 sm:py-8 lg:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="h-7 w-32 rounded-full bg-slate-800" />

                            <div className="mt-4 h-10 w-48 rounded-lg bg-slate-800 sm:h-11 sm:w-56" />

                            <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-4/5 max-w-md rounded bg-slate-800" />
                        </div>

                        <div className="h-11 w-full rounded-xl bg-slate-800 sm:w-40" />
                    </div>
                </section>

                <section className="mt-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="h-11 flex-1 rounded-xl border border-slate-800 bg-[#0F172A]" />
                        <div className="h-11 w-full rounded-xl border border-slate-800 bg-[#0F172A] sm:w-40" />
                    </div>
                </section>

                <section className="mt-8">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="h-6 w-36 rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-64 rounded bg-slate-800" />
                        </div>

                        <div className="h-7 w-24 rounded-lg bg-slate-800" />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="flex min-h-[320px] flex-col justify-between rounded-2xl border border-slate-800 bg-[#111827] p-5"
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="h-12 w-12 rounded-xl bg-slate-800" />
                                        <div className="h-9 w-9 rounded-lg bg-slate-800" />
                                    </div>

                                    <div className="mt-5 flex items-center gap-2">
                                        <div className="h-5 w-32 rounded bg-slate-800" />
                                        <div className="h-5 w-16 rounded-full bg-slate-800" />
                                    </div>

                                    <div className="mt-3 h-4 w-full rounded bg-slate-800" />
                                    <div className="mt-2 h-4 w-4/5 rounded bg-slate-800" />
                                </div>

                                <div className="mt-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-3">
                                            <div className="h-4 w-16 rounded bg-slate-800" />
                                            <div className="mt-3 h-5 w-20 rounded bg-slate-800" />
                                            <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
                                        </div>

                                        <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-3">
                                            <div className="h-4 w-14 rounded bg-slate-800" />
                                            <div className="mt-3 h-5 w-16 rounded bg-slate-800" />
                                            <div className="mt-2 h-3 w-20 rounded bg-slate-800" />
                                        </div>
                                    </div>

                                    <div className="mt-4 h-10 w-full rounded-xl bg-slate-800" />
                                </div>
                            </div>
                        ))}

                        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/40 p-6">
                            <div className="h-12 w-12 rounded-xl bg-slate-800" />
                            <div className="mt-4 h-4 w-32 rounded bg-slate-800" />
                            <div className="mt-2 h-3 w-52 max-w-full rounded bg-slate-800" />
                            <div className="mt-1 h-3 w-40 max-w-full rounded bg-slate-800" />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}