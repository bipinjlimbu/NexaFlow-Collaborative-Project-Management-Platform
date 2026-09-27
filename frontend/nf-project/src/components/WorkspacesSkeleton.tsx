export default function WorkspacesSkeleton() {
    return (
        <main className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-50">
            <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A]">
                    <div className="flex flex-col gap-7 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-8">
                        <div className="max-w-2xl">
                            <div className="h-7 w-40 rounded-full bg-indigo-500/10" />
                            <div className="mt-5 h-10 w-48 rounded-lg bg-slate-800 sm:h-11" />
                            <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-900" />
                            <div className="mt-2 h-4 w-4/5 max-w-lg rounded bg-slate-900" />
                        </div>

                        <div className="h-11 w-full rounded-xl bg-indigo-500/10 sm:w-44" />
                    </div>
                </section>

                <section className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="h-11 w-full rounded-xl border border-slate-800 bg-[#0F172A] sm:max-w-md lg:max-w-lg" />
                    <div className="h-3 w-24 rounded bg-slate-900" />
                </section>

                <section className="mt-8">
                    <div className="mb-5">
                        <div className="h-5 w-36 rounded bg-slate-800" />
                        <div className="mt-2 h-3 w-48 rounded bg-slate-900" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="flex min-h-[330px] flex-col justify-between rounded-2xl border border-slate-800 bg-[#111827] p-5"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-500/10" />
                                        <div className="h-8 w-8 rounded-lg bg-slate-900" />
                                    </div>

                                    <div className="mt-5 flex items-center gap-2">
                                        <div className="h-4 w-32 rounded bg-slate-800" />
                                        <div className="h-5 w-12 rounded-md bg-slate-900" />
                                    </div>

                                    <div className="mt-3 h-3 w-full rounded bg-slate-900" />
                                    <div className="mt-2 h-3 w-4/5 rounded bg-slate-900" />
                                </div>

                                <div>
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                                            <div className="h-3 w-16 rounded bg-slate-900" />
                                            <div className="mt-2 h-5 w-8 rounded bg-slate-800" />
                                        </div>

                                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                                            <div className="h-3 w-16 rounded bg-slate-900" />
                                            <div className="mt-2 h-5 w-8 rounded bg-slate-800" />
                                        </div>
                                    </div>

                                    <div className="mt-4 h-10 w-full rounded-xl bg-slate-900" />
                                </div>
                            </div>
                        ))}

                        <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/60 p-6 text-center">
                            <div className="h-12 w-12 rounded-xl bg-slate-900" />
                            <div className="mt-4 h-4 w-36 rounded bg-slate-800" />
                            <div className="mt-2 h-3 w-48 rounded bg-slate-900" />
                            <div className="mt-1 h-3 w-40 rounded bg-slate-900" />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}