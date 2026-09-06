"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/authService";

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

    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            profile_picture: e.target.files?.[0] || null,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            await register(formData);
            router.push("/login");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Registration failed"
            );
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

                <div className="grid gap-4 sm:grid-cols-2">
                    <input
                        name="first_name"
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />

                    <input
                        name="last_name"
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />

                    <input
                        name="confirm_password"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <input
                    name="phone_number"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <input
                    name="address"
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

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
                </div>

                {error && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
                >
                    Create Account
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