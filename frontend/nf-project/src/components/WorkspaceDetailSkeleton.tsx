export default function WorkspaceDetailSkeleton() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-7xl animate-pulse px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="h-5 w-28 rounded bg-slate-800" />

                    <div className="flex gap-2">
                        <div className="h-10 w-32 rounded-xl bg-slate-800" />
                        <div className="h-10 w-20 rounded-xl bg-slate-800" />
                    </div>
                </div>

                <div className="mt-7 rounded-3xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="w-full">
                            <div className="flex gap-2">
                                <div className="h-6 w-24 rounded-full bg-slate-800" />
                                <div className="h-6 w-16 rounded-full bg-slate-800" />
                            </div>

                            <div className="mt-4 h-10 w-2/3 max-w-xl rounded bg-slate-800" />

                            <div className="mt-4 h-4 w-full max-w-2xl rounded bg-slate-800" />
                            <div className="mt-2 h-4 w-4/5 max-w-xl rounded bg-slate-800" />
                        </div>

                        <div className="h-11 w-full rounded-xl bg-slate-800 sm:w-36" />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
                        >
                            <div className="h-3 w-16 rounded bg-slate-800" />
                            <div className="mt-4 h-7 w-20 rounded bg-slate-800" />
                        </div>
                    ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 lg:col-span-2">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="h-5 w-48 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-64 rounded bg-slate-800" />
                            </div>

                            <div className="hidden h-10 w-10 rounded-xl bg-slate-800 sm:block" />
                        </div>

                        <div className="mt-6 divide-y divide-slate-800">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="h-4 w-24 rounded bg-slate-800" />
                                    <div className="h-4 w-28 rounded bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                        <div className="h-5 w-40 rounded bg-slate-800" />
                        <div className="mt-2 h-3 w-52 rounded bg-slate-800" />

                        <div className="mt-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-800" />

                            <div className="flex-1">
                                <div className="h-4 w-28 rounded bg-slate-800" />
                                <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <div className="h-3 w-12 rounded bg-slate-800" />
                                <div className="mt-2 h-4 w-full rounded bg-slate-800" />
                            </div>

                            <div>
                                <div className="h-3 w-12 rounded bg-slate-800" />
                                <div className="mt-2 h-4 w-28 rounded bg-slate-800" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                    <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-20 rounded bg-slate-800" />
                                <div className="h-6 w-8 rounded-full bg-slate-800" />
                            </div>

                            <div className="mt-2 h-3 w-60 rounded bg-slate-800" />
                        </div>

                        <div className="h-10 w-full rounded-xl bg-slate-800 sm:w-32" />
                    </div>

                    <div className="divide-y divide-slate-800">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex flex-col gap-4 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-xl bg-slate-800" />

                                    <div>
                                        <div className="h-4 w-32 rounded bg-slate-800" />
                                        <div className="mt-2 h-3 w-48 rounded bg-slate-800" />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <div className="h-8 w-20 rounded-lg bg-slate-800" />
                                    <div className="h-8 w-20 rounded-lg bg-slate-800" />
                                    <div className="h-6 w-14 rounded-full bg-slate-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
                    <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-20 rounded bg-slate-800" />
                                <div className="h-6 w-8 rounded-full bg-slate-800" />
                            </div>

                            <div className="mt-2 h-3 w-64 rounded bg-slate-800" />
                        </div>

                        <div className="h-10 w-full rounded-xl bg-slate-800 sm:w-32" />
                    </div>

                    <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2">
                        {[1, 2].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="w-full">
                                        <div className="h-5 w-2/3 rounded bg-slate-800" />
                                        <div className="mt-3 h-4 w-full rounded bg-slate-800" />
                                        <div className="mt-2 h-4 w-4/5 rounded bg-slate-800" />
                                    </div>

                                    <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-800" />
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <div className="h-7 w-24 rounded-lg bg-slate-800" />
                                    <div className="h-7 w-24 rounded-lg bg-slate-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}