"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/authService";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const data = await login(username, password);

            localStorage.setItem("access", data.tokens.access);
            localStorage.setItem("refresh", data.tokens.refresh);

            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Login failed");
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6 py-12 selection:bg-indigo-500 selection:text-white">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm"
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-indigo-600/30">
                            N
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">
                            NexaFlow
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white pt-2">Sign In</h1>
                    <p className="text-sm text-slate-400">
                        Sign in to your NexaFlow account
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                {error && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
                >
                    Sign In
                </button>

                <p className="text-center text-xs text-slate-400 pt-2">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                        Create account
                    </Link>
                </p>
            </form>
        </main>
    );
}