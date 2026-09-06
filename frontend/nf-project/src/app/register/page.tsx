"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        <main className="flex min-h-screen items-center justify-center px-6 py-12">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-8"
            >
                <div>
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Create your NexaFlow account
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <input
                        name="first_name"
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                    />

                    <input
                        name="last_name"
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                    />
                </div>

                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                    />

                    <input
                        name="confirm_password"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                    />
                </div>

                <input
                    name="phone_number"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                />

                <input
                    name="address"
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                />

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Profile Picture
                    </label>

                    <input
                        name="profile_picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800"
                >
                    Create Account
                </button>
            </form>
        </main>
    );
}