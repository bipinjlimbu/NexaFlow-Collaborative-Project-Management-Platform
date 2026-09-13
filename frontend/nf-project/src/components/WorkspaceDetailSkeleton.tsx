export default function WorkspaceDetailSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />

                <div className="mt-8 h-8 w-72 animate-pulse rounded bg-slate-800" />
                <div className="mt-3 h-4 w-96 animate-pulse rounded bg-slate-800" />

                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-28 animate-pulse rounded-xl border border-slate-800/80 bg-slate-900/40"
                        />
                    ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="h-80 animate-pulse rounded-xl border border-slate-800/80 bg-slate-900/40 lg:col-span-2" />
                    <div className="h-80 animate-pulse rounded-xl border border-slate-800/80 bg-slate-900/40" />
                </div>

                <div className="mt-6 h-72 animate-pulse rounded-xl border border-slate-800/80 bg-slate-900/40" />

                <div className="mt-6 h-48 animate-pulse rounded-xl border border-slate-800/80 bg-slate-900/40" />
            </div>
        </div>
    );
}