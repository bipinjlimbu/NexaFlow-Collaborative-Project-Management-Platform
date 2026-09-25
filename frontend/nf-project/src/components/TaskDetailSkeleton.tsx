export default function TaskDetailSkeleton() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <div className="animate-pulse">
                    <div className="h-4 w-32 rounded bg-slate-800" />
                    <div className="mt-6 h-10 w-80 rounded bg-slate-800" />
                    <div className="mt-3 h-4 w-96 rounded bg-slate-800" />
                    <div className="mt-10 h-64 rounded-xl bg-slate-900" />
                </div>
            </div>
        </main>
    );
}