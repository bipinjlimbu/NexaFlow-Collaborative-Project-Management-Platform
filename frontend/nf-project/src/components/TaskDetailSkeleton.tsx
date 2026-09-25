export default function TaskDetailSkeleton() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <div className="animate-pulse">
                    <div className="h-4 w-32 rounded bg-slate-800" />
                    <div className="mt-6 h-10 w-80 rounded bg-slate-800" />
                    <div className="mt-3 h-4 w-96 rounded bg-slate-800" />

                    <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="h-12 flex-1 rounded-lg bg-slate-800" />
                            <div className="h-12 flex-1 rounded-lg bg-slate-800" />
                            <div className="h-12 flex-1 rounded-lg bg-slate-800" />
                            <div className="h-12 flex-1 rounded-lg bg-slate-800" />
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        <div className="h-64 rounded-xl bg-slate-900" />
                        <div className="h-64 rounded-xl bg-slate-900" />
                    </div>
                </div>
            </div>
        </main>
    );
}