export default function LoginSkeleton() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6 py-12 animate-pulse">
            <div className="w-full max-w-md space-y-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-xl">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-800/80" />
                        <div className="h-6 w-28 rounded-md bg-slate-800/80" />
                    </div>
                    <div className="h-7 w-24 rounded-md bg-slate-800/80" />
                    <div className="h-4 w-48 rounded bg-slate-800/60" />
                </div>

                <div className="space-y-4 pt-2">
                    <div className="h-11 w-full rounded-xl border border-slate-800/80 bg-slate-950/60" />
                    <div className="h-11 w-full rounded-xl border border-slate-800/80 bg-slate-950/60" />
                    <div className="h-11 w-full rounded-xl bg-slate-800/80" />
                </div>

                <div className="flex justify-center pt-2">
                    <div className="h-4 w-52 rounded bg-slate-800/60" />
                </div>
            </div>
        </main>
    );
}