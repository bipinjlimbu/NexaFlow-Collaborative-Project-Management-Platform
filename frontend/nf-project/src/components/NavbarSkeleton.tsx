export default function NavbarSkeleton() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#020617]/95">
            <div className="mx-auto flex h-[72px] max-w-7xl animate-pulse items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl border border-slate-800 bg-[#111827]" />

                    <div className="hidden sm:block">
                        <div className="h-3.5 w-20 rounded bg-slate-800" />
                        <div className="mt-2 h-2 w-24 rounded bg-slate-900" />
                    </div>
                </div>

                <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-slate-800/80 bg-[#0F172A]/80 p-1 md:flex">
                    <div className="h-9 w-20 rounded-lg bg-slate-800" />
                    <div className="h-9 w-24 rounded-lg bg-slate-900" />
                    <div className="h-9 w-20 rounded-lg bg-slate-900" />
                    <div className="h-9 w-16 rounded-lg bg-slate-900" />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-10 w-10 rounded-xl border border-slate-800 bg-[#111827]" />

                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-[#111827] py-1.5 pl-1.5 pr-2.5">
                        <div className="h-8 w-8 rounded-lg bg-slate-800" />

                        <div className="hidden sm:block">
                            <div className="h-2.5 w-20 rounded bg-slate-800" />
                            <div className="mt-2 h-2 w-16 rounded bg-slate-900" />
                        </div>

                        <div className="hidden h-3.5 w-3.5 rounded bg-slate-800 sm:block" />
                    </div>
                </div>
            </div>
        </header>
    );
}