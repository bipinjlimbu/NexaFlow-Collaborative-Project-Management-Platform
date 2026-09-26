export default function NavbarSkeleton() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#020617]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[68px] max-w-7xl animate-pulse items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-slate-800" />
                    <div className="hidden h-5 w-24 rounded-md bg-slate-800 sm:block" />
                </div>

                <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-slate-800/80 bg-[#0F172A]/70 p-1 md:flex">
                    <div className="h-9 w-20 rounded-lg bg-slate-800" />
                    <div className="h-9 w-24 rounded-lg bg-slate-800/70" />
                    <div className="h-9 w-20 rounded-lg bg-slate-800/70" />
                    <div className="h-9 w-16 rounded-lg bg-slate-800/70" />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-10 w-10 rounded-xl border border-slate-800 bg-[#111827]" />

                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-[#111827] py-1.5 pl-1.5 pr-2.5">
                        <div className="h-8 w-8 rounded-lg bg-slate-800" />

                        <div className="hidden space-y-1.5 sm:block">
                            <div className="h-2.5 w-20 rounded bg-slate-800" />
                            <div className="h-2 w-14 rounded bg-slate-800/70" />
                        </div>

                        <div className="hidden h-3.5 w-3.5 rounded bg-slate-800 sm:block" />
                    </div>
                </div>
            </div>
        </header>
    );
}