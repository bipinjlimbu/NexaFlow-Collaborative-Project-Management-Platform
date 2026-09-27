"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/authService";
import RegisterSkeleton from "@/components/RegisterSkeleton";

function FieldError({ error }: { error?: string | string[] }) {
    if (!error) return null;
    const message = Array.isArray(error) ? error[0] : error;
    return <p className="mt-1.5 text-xs text-rose-400">{message}</p>;
}

export default function RegisterPage() {
    const router = useRouter();

    const [isChecking, setIsChecking] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        profile_picture: null as File | null,
    });

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

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (fieldErrors[e.target.name]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[e.target.name];
                return next;
            });
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            profile_picture: e.target.files?.[0] || null,
        });

        if (fieldErrors.profile_picture) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.profile_picture;
                return next;
            });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await register(formData);
            router.push("/login");
        } catch (err: any) {
            if (typeof err === "object" && err !== null) {
                if (err.detail) {
                    setError(err.detail);
                } else if (err.error) {
                    setError(err.error);
                } else {
                    setFieldErrors(err);
                }
            } else if (typeof err === "string") {
                setError(err);
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (isChecking) {
        return <RegisterSkeleton />;
    }

    return (
        <main className="min-h-screen bg-[#020617] px-4 py-8 text-slate-50 selection:bg-indigo-500 selection:text-white sm:px-6 sm:py-12">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-2xl shadow-black/20 lg:grid-cols-[0.82fr_1.18fr]">
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

                            <div className="mt-20 max-w-sm">
                                <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                    Get started
                                </div>

                                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white">
                                    Build your workspace.
                                    <span className="block text-slate-400">
                                        Keep everything moving.
                                    </span>
                                </h1>

                                <p className="mt-5 text-sm leading-7 text-slate-400">
                                    Create your NexaFlow account and bring your
                                    workspaces, projects, and tasks together in
                                    one place.
                                </p>
                            </div>
                        </div>

                        <div className="relative border-t border-slate-800 pt-5">
                            <p className="text-xs leading-5 text-slate-500">
                                A focused workspace for organizing work and
                                keeping your team aligned.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-5 sm:p-7 lg:p-9 xl:p-10"
                    >
                        <div className="mb-7">
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

                            <div className="mt-7 lg:mt-0">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                    Create account
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                    Welcome to NexaFlow
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    Enter your details to create your account.
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
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Personal details
                                </p>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            First Name
                                        </label>

                                        <input
                                            name="first_name"
                                            type="text"
                                            placeholder="Enter first name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.first_name
                                                ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        <FieldError
                                            error={fieldErrors.first_name}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Last Name
                                        </label>

                                        <input
                                            name="last_name"
                                            type="text"
                                            placeholder="Enter last name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.last_name
                                                ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        <FieldError
                                            error={fieldErrors.last_name}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Username
                                </label>

                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.username
                                        ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                        }`}
                                />

                                <FieldError error={fieldErrors.username} />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Email
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.email
                                        ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                        }`}
                                />

                                <FieldError error={fieldErrors.email} />
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Password
                                </p>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Password
                                        </label>

                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.password
                                                ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        <FieldError
                                            error={fieldErrors.password}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Confirm Password
                                        </label>

                                        <input
                                            name="confirm_password"
                                            type="password"
                                            placeholder="Repeat your password"
                                            value={formData.confirm_password}
                                            onChange={handleChange}
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.confirm_password
                                                ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        <FieldError
                                            error={
                                                fieldErrors.confirm_password
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Contact
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Phone Number
                                        </label>

                                        <input
                                            name="phone_number"
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.phone_number
                                                ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        <FieldError
                                            error={fieldErrors.phone_number}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Address
                                        </label>

                                        <input
                                            name="address"
                                            type="text"
                                            placeholder="Enter your address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${fieldErrors.address
                                                ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        <FieldError
                                            error={fieldErrors.address}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Profile Picture
                                </label>

                                <input
                                    name="profile_picture"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] text-sm text-slate-400 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-slate-800 file:bg-slate-800 file:px-4 file:py-3 file:text-xs file:font-semibold file:text-indigo-400 hover:file:bg-slate-700"
                                />

                                <FieldError
                                    error={fieldErrors.profile_picture}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                            <p className="pt-1 text-center text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-indigo-400 transition hover:text-indigo-300"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}