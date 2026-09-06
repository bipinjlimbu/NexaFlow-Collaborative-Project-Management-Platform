export default function Loading() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-2xl space-y-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm animate-pulse">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-800" />
                        <div className="h-5 w-24 rounded-md bg-slate-800" />
                    </div>
                    <div className="h-7 w-44 rounded-md bg-slate-800 mt-2" />
                    <div className="h-4 w-64 rounded-md bg-slate-800/60" />
                </div>

                <div className="space-y-4 pt-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="h-11 w-full rounded-xl bg-slate-800/80" />
                        <div className="h-11 w-full rounded-xl bg-slate-800/80" />
                    </div>

                    <div className="h-11 w-full rounded-xl bg-slate-800/80" />

                    <div className="h-11 w-full rounded-xl bg-slate-800/80" />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="h-11 w-full rounded-xl bg-slate-800/80" />
                        <div className="h-11 w-full rounded-xl bg-slate-800/80" />
                    </div>

                    <div className="h-11 w-full rounded-xl bg-slate-800/80" />

                    <div className="h-11 w-full rounded-xl bg-slate-800/80" />

                    <div className="space-y-2">
                        <div className="h-3 w-28 rounded bg-slate-800/60" />
                        <div className="h-11 w-full rounded-xl bg-slate-800/80" />
                    </div>
                </div>

                <div className="h-11 w-full rounded-xl bg-indigo-600/40 mt-2" />

                <div className="h-4 w-48 mx-auto rounded-md bg-slate-800/60" />
            </div>
        </main>
    );
}