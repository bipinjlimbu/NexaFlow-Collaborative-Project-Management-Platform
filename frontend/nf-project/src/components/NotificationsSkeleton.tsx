export default function NotificationsSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />

                <div className="mt-8 h-8 w-48 animate-pulse rounded bg-slate-800" />

                <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-800" />

                <div className="mt-8 space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="h-28 animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/40"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}