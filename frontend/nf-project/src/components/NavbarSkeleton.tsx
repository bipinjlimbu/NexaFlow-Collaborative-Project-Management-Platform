export default function NavbarSkeleton() {
    return (
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 animate-pulse">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-800" />
                    <div className="h-5 w-24 bg-slate-800 rounded-md" />
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <div className="h-4 w-16 bg-slate-800/80 rounded" />
                    <div className="h-4 w-20 bg-slate-800/80 rounded" />
                    <div className="h-4 w-16 bg-slate-800/80 rounded" />
                    <div className="h-4 w-14 bg-slate-800/80 rounded" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-slate-800/80" />
                    <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                        <div className="h-8 w-8 rounded-full bg-slate-800/80" />
                        <div className="hidden sm:block space-y-1">
                            <div className="h-3 w-16 bg-slate-800/80 rounded" />
                            <div className="h-2 w-20 bg-slate-800/60 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}