export default function LandingSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-between animate-pulse">
            <main className="max-w-6xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center w-full">
                <div className="h-7 w-52 rounded-full bg-slate-800/80 mb-8" />

                <div className="space-y-4 max-w-4xl w-full flex flex-col items-center">
                    <div className="h-12 sm:h-16 w-3/4 bg-slate-800/80 rounded-2xl" />
                    <div className="h-12 sm:h-16 w-1/2 bg-slate-800/80 rounded-2xl" />
                </div>

                <div className="mt-6 space-y-2 max-w-2xl w-full flex flex-col items-center">
                    <div className="h-4 w-5/6 bg-slate-800/60 rounded-md" />
                    <div className="h-4 w-4/6 bg-slate-800/60 rounded-md" />
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                    <div className="h-12 w-full sm:w-44 rounded-xl bg-indigo-600/40" />
                    <div className="h-12 w-full sm:w-36 rounded-xl bg-slate-800/80" />
                </div>

                <div className="mt-20 w-full text-left">
                    <div className="p-1 bg-slate-900/40 rounded-2xl border border-slate-800/80">
                        <div className="bg-slate-950 p-6 md:p-8 rounded-[14px]">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-slate-800" />
                                    <div className="h-3 w-3 rounded-full bg-slate-800" />
                                    <div className="h-3 w-3 rounded-full bg-slate-800" />
                                </div>
                                <div className="h-3 w-36 rounded bg-slate-800/60" />
                            </div>

                            <div className="space-y-4">
                                <div className="h-5 w-48 rounded bg-slate-800/80" />
                                <div className="pl-6 border-l-2 border-slate-800 space-y-3">
                                    <div className="h-4 w-64 rounded bg-slate-800/80" />
                                    <div className="pl-6 space-y-2">
                                        <div className="h-9 w-full rounded-lg bg-slate-900/80 border border-slate-800/80" />
                                        <div className="h-9 w-full rounded-lg bg-slate-900/80 border border-slate-800/80" />
                                        <div className="h-9 w-full rounded-lg bg-slate-900/80 border border-slate-800/80" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid md:grid-cols-3 gap-6 text-left w-full">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4"
                        >
                            <div className="h-10 w-10 rounded-lg bg-slate-800/80" />
                            <div className="h-5 w-3/4 rounded bg-slate-800/80" />
                            <div className="space-y-2">
                                <div className="h-3 w-full rounded bg-slate-800/60" />
                                <div className="h-3 w-4/5 rounded bg-slate-800/60" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-8 md:p-12 rounded-3xl bg-slate-900/30 border border-slate-800/80 text-left w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="max-w-xl space-y-3 w-full">
                        <div className="h-6 w-56 bg-slate-800/80 rounded" />
                        <div className="h-4 w-full bg-slate-800/60 rounded" />
                    </div>
                    <div className="h-11 w-44 bg-slate-800/80 rounded-xl" />
                </div>
            </main>
        </div>
    );
}