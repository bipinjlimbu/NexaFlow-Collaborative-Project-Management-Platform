"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/authService";
import LoginSkeleton from "@/components/LoginSkeleton";

function FieldError({ error }: { error?: string | string[] }) {
    if (!error) return null;

    const message = Array.isArray(error) ? error[0] : error;

    return <p className="mt-1.5 text-xs text-rose-400">{message}</p>;
}

export default function LoginPage() {
    const router = useRouter();

    const [isChecking, setIsChecking] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<
        Record<string, string | string[]>
    >({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (token) {
            alert("You are already logged in.");
            router.replace("/dashboard");
        } else {
            setIsChecking(false);
        }
    }, [router]);

    function handleUsernameChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        setUsername(e.target.value);

        if (fieldErrors.username) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.username;
                return next;
            });
        }
    }

    function handlePasswordChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
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

            const access = data.tokens.access;
            const refresh = data.tokens.refresh;
            const user = data.user;

            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("user", JSON.stringify(user));

            window.dispatchEvent(new Event("auth-change"));

            router.push("/");
        } catch (err: any) {
            if (typeof err === "object" && err !== null) {
                const payload = err.errors || err;

                if (payload.detail) {
                    setError(
                        typeof payload.detail === "string"
                            ? payload.detail
                            : payload.detail[0]
                    );
                } else if (payload.error) {
                    setError(
                        typeof payload.error === "string"
                            ? payload.error
                            : payload.error[0]
                    );
                } else if (payload.non_field_errors) {
                    setError(
                        Array.isArray(payload.non_field_errors)
                            ? payload.non_field_errors[0]
                            : payload.non_field_errors
                    );
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

    if (isChecking) {
        return <LoginSkeleton />;
    }

    return (
        <main className="min-h-screen bg-[#020617] px-4 py-8 text-slate-50 selection:bg-indigo-500 selection:text-white sm:px-6 sm:py-12">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-2xl shadow-black/20 lg:grid-cols-[1fr_1fr]">
                    <div className="relative hidden overflow-hidden border-r border-slate-800 bg-[#0F172A] p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl" />

                        <div className="relative">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                                    N
                                </div>

                                <span className="text-lg font-bold tracking-tight text-white">
                                    NexaFlow
                                </span>
                            </Link>

                            <div className="mt-24 max-w-sm">
                                <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                    Welcome back
                                </div>

                                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white">
                                    Keep your work
                                    <span className="block text-slate-400">
                                        moving forward.
                                    </span>
                                </h1>

                                <p className="mt-5 text-sm leading-7 text-slate-400">
                                    Sign in to access your workspaces, projects,
                                    and tasks from one focused workspace.
                                </p>
                            </div>
                        </div>

                        <div className="relative border-t border-slate-800 pt-5">
                            <p className="text-xs leading-5 text-slate-500">
                                Simple workspace management for organized,
                                productive work.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-5 sm:p-8 lg:p-10 xl:p-12"
                    >
                        <div className="mb-8">
                            <div className="flex items-center gap-3 lg:hidden">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                                        N
                                    </div>

                                    <span className="text-lg font-bold tracking-tight text-white">
                                        NexaFlow
                                    </span>
                                </Link>
                            </div>

                            <div className="mt-8 lg:mt-0">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                    Account access
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                    Sign in
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    Enter your credentials to continue.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-5 text-rose-400">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    className={`h-12 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.username
                                        ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                        }`}
                                />

                                <FieldError error={fieldErrors.username} />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`h-12 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.password
                                        ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                        }`}
                                />

                                <FieldError error={fieldErrors.password} />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-12 w-full rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </div>

                        <p className="mt-7 text-center text-sm text-slate-500">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-indigo-400 transition hover:text-indigo-300"
                            >
                                Create account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}