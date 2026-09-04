import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-8rem)] bg-slate-950 text-slate-50 flex items-center justify-center px-6 py-20 selection:bg-indigo-500 selection:text-white">
            <div className="max-w-md w-full text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-mono text-xl font-bold flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/5">
                    404
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                    Page not found
                </h1>

                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    The workspace, project, or task page you are looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link
                        href="/dashboard"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-sm text-center active:scale-95"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white font-medium px-5 py-3 rounded-xl transition-all text-sm text-center"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}