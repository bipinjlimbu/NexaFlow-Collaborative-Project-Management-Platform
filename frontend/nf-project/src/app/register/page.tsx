"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/authService";

function FieldError({ error }: { error?: string | string[] }) {
    if (!error) return null;
    const message = Array.isArray(error) ? error[0] : error;
    return <p className="text-xs text-rose-400 mt-1">{message}</p>;
}

export default function RegisterPage() {
    const router = useRouter();

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
    const [fieldErrors, setFieldErrors] = useState<Record<string, string | string[]>>({});
    const [loading, setLoading] = useState(false);

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

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6 py-12 selection:bg-indigo-500 selection:text-white">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl space-y-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm"
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
                    <h1 className="text-2xl font-bold tracking-tight text-white pt-2">Create Account</h1>
                    <p className="text-sm text-slate-400">
                        Create your NexaFlow account to manage your workspace
                    </p>
                </div>

                {error && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <input
                            name="first_name"
                            type="text"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <FieldError error={fieldErrors.first_name} />
                    </div>

                    <div>
                        <input
                            name="last_name"
                            type="text"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <FieldError error={fieldErrors.last_name} />
                    </div>
                </div>

                <div>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <FieldError error={fieldErrors.username} />
                </div>

                <div>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <FieldError error={fieldErrors.email} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <FieldError error={fieldErrors.password} />
                    </div>

                    <div>
                        <input
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <FieldError error={fieldErrors.confirm_password} />
                    </div>
                </div>

                <div>
                    <input
                        name="phone_number"
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <FieldError error={fieldErrors.phone_number} />
                </div>

                <div>
                    <input
                        name="address"
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <FieldError error={fieldErrors.address} />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Profile Picture
                    </label>

                    <input
                        name="profile_picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-400 hover:file:bg-indigo-600/20 cursor-pointer"
                    />
                    <FieldError error={fieldErrors.profile_picture} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-center text-xs text-slate-400 pt-2">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </main>
    );
}