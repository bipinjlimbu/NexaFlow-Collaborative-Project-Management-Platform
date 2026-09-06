"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/authService";

function FieldError({ error }: { error?: string | string[] }) {
    if (!error) return null;
    const message = Array.isArray(error) ? error[0] : error;
    return <p className="text-xs text-rose-400 mt-1">{message}</p>;
}

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string | string[]>>({});
    const [loading, setLoading] = useState(false);

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
        if (fieldErrors.username) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.username;
                return next;
            });
        }
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        if (fieldErrors.password) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.password;
                return next;
            });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setLoading(true);

        try {
            const data = await login(username, password);

            const access = data?.tokens?.access || data?.access;
            const refresh = data?.tokens?.refresh || data?.refresh;

            if (access) localStorage.setItem("access", access);
            if (refresh) localStorage.setItem("refresh", refresh);

            window.dispatchEvent(new Event("auth-change"));

            router.push("/");
        } catch (err: any) {
            if (typeof err === "object" && err !== null) {
                const payload = err.errors || err;

                if (payload.detail) {
                    setError(typeof payload.detail === "string" ? payload.detail : payload.detail[0]);
                } else if (payload.error) {
                    setError(typeof payload.error === "string" ? payload.error : payload.error[0]);
                } else if (payload.non_field_errors) {
                    setError(Array.isArray(payload.non_field_errors) ? payload.non_field_errors[0] : payload.non_field_errors);
                } else {
                    setFieldErrors(payload);
                }
            } else if (typeof err === "string") {
                setError(err);
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
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

                {error && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
                        {error}
                    </div>
                )}

                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={handleUsernameChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <FieldError error={fieldErrors.username} />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <FieldError error={fieldErrors.password} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Signing in..." : "Sign In"}
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