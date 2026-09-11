"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import LogoutButton from "@/components/LogoutButton";
import {
    deleteProfile,
    updateProfile,
} from "@/services/profileService";
import { Pencil, Trash2, X } from "lucide-react";

interface User {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    address?: string;
    profile_picture?: string;
}

interface ProfileErrors {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    address?: string;
    profile_picture?: string;
    error?: string;
    detail?: string;
    message?: string;
}

export default function ProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [editErrors, setEditErrors] = useState<ProfileErrors>({});
    const [deleteError, setDeleteError] = useState("");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const [profilePicturePreview, setProfilePicturePreview] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

    useEffect(() => {
        const access = localStorage.getItem("access");
        const storedUser = localStorage.getItem("user");

        if (!access || !storedUser) {
            setIsAuthenticated(false);
            router.replace("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            setUser(parsedUser);
            setIsAuthenticated(true);
        } catch {
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            router.replace("/login");
        }
    }, [router]);

    if (isAuthenticated === null || !user) {
        return <ProfileSkeleton />;
    }

    if (!isAuthenticated) {
        return <ProfileSkeleton />;
    }

    const fullName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username ||
        "User";

    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const profileImage = user.profile_picture
        ? `${API_URL}${user.profile_picture}`
        : "";

    const openEditForm = () => {
        setUsername(user.username || "");
        setEmail(user.email || "");
        setFirstName(user.first_name || "");
        setLastName(user.last_name || "");
        setPhoneNumber(user.phone_number || "");
        setAddress(user.address || "");
        setProfilePicture(null);
        setProfilePicturePreview("");
        setEditErrors({});
        setShowEditForm(true);
    };

    const closeEditForm = () => {
        if (saving) return;

        setShowEditForm(false);
        setProfilePicture(null);
        setProfilePicturePreview("");
        setEditErrors({});
    };

    const handleProfilePictureChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0] || null;

        setProfilePicture(file);

        if (file) {
            setProfilePicturePreview(URL.createObjectURL(file));
        } else {
            setProfilePicturePreview("");
        }
    };

    const getErrorMessage = (error: ProfileErrors) => {
        if (error.error) return error.error;
        if (error.detail) return error.detail;
        if (error.message) return error.message;
        return "Failed to update profile.";
    };

    const handleUpdateProfile = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setSaving(true);
        setEditErrors({});

        try {
            const updatedUser = await updateProfile({
                username: username.trim(),
                email: email.trim(),
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone_number: phoneNumber.trim(),
                address: address.trim(),
                profile_picture: profilePicture,
            });

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            setShowEditForm(false);
            setProfilePicture(null);
            setProfilePicturePreview("");
            setEditErrors({});
        } catch (err) {
            const error =
                typeof err === "object" && err !== null
                    ? (err as ProfileErrors)
                    : {};

            setEditErrors(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProfile = async () => {
        setDeleting(true);
        setDeleteError("");

        try {
            await deleteProfile();

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");

            window.dispatchEvent(new Event("auth-change"));

            router.replace("/login");
        } catch (err) {
            if (typeof err === "object" && err !== null) {
                if ("error" in err) {
                    setDeleteError(String(err.error));
                } else if ("detail" in err) {
                    setDeleteError(String(err.detail));
                } else if ("message" in err) {
                    setDeleteError(String(err.message));
                } else {
                    setDeleteError("Failed to delete your account.");
                }
            } else {
                setDeleteError("Failed to delete your account.");
            }

            setDeleting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <Link
                            href="/dashboard"
                            className="cursor-pointer transition hover:text-slate-300"
                        >
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-slate-400">Profile</span>
                    </div>

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-indigo-400">
                                Account
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight">
                                Profile
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Manage your personal information and account preferences.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <LogoutButton />

                            <button
                                onClick={openEditForm}
                                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 text-sm font-medium text-white transition hover:bg-indigo-400"
                            >
                                <Pencil size={15} />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <section className="mb-6 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="h-28 bg-gradient-to-r from-indigo-500/20 via-slate-900 to-sky-500/10" />

                    <div className="px-6 pb-6">
                        <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end">
                                {user.profile_picture ? (
                                    <img
                                        src={profileImage}
                                        alt={fullName}
                                        className="h-24 w-24 rounded-2xl border-4 border-slate-950 object-cover shadow-xl"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-slate-950 bg-indigo-500 text-2xl font-semibold text-white shadow-xl">
                                        {initials}
                                    </div>
                                )}

                                <div className="pb-1">
                                    <h2 className="text-2xl font-semibold text-white">
                                        {fullName}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        @{user.username || "user"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-start md:self-auto">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 lg:col-span-2">
                        <div className="border-b border-slate-800/80 px-6 py-5">
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                Personal Information
                            </p>

                            <h2 className="mt-1 text-lg font-semibold">
                                Account Details
                            </h2>
                        </div>

                        <div className="grid gap-px bg-slate-800/60 sm:grid-cols-2">
                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    First Name
                                </p>
                                <p className="text-sm text-slate-200">
                                    {user.first_name || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Last Name
                                </p>
                                <p className="text-sm text-slate-200">
                                    {user.last_name || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Username
                                </p>
                                <p className="text-sm text-slate-200">
                                    {user.username || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Email
                                </p>
                                <p className="break-all text-sm text-slate-200">
                                    {user.email || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Phone Number
                                </p>
                                <p className="text-sm text-slate-200">
                                    {user.phone_number || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-900/60 p-6 sm:col-span-2">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Address
                                </p>
                                <p className="text-sm text-slate-200">
                                    {user.address || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="space-y-6">
                        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40">
                            <div className="border-b border-slate-800/80 px-6 py-5">
                                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                    Account
                                </p>

                                <h2 className="mt-1 text-lg font-semibold">
                                    Security
                                </h2>
                            </div>

                            <div className="divide-y divide-slate-800/80">
                                <Link
                                    href="/profile/password"
                                    className="flex cursor-pointer items-center justify-between px-6 py-5 transition hover:bg-slate-800/30"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            Change Password
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Update your account password
                                        </p>
                                    </div>

                                    <span className="text-slate-600">→</span>
                                </Link>

                                <Link
                                    href="/profile/sessions"
                                    className="flex cursor-pointer items-center justify-between px-6 py-5 transition hover:bg-slate-800/30"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            Active Sessions
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Review your logged-in devices
                                        </p>
                                    </div>

                                    <span className="text-slate-600">→</span>
                                </Link>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40">
                            <div className="border-b border-slate-800/80 px-6 py-5">
                                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                    Preferences
                                </p>

                                <h2 className="mt-1 text-lg font-semibold">
                                    Notifications
                                </h2>
                            </div>

                            <div className="divide-y divide-slate-800/80">
                                <div className="flex items-center justify-between px-6 py-5">
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            Task Updates
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Receive updates about assigned tasks
                                        </p>
                                    </div>

                                    <div className="h-5 w-9 rounded-full bg-indigo-500 p-0.5">
                                        <div className="ml-4 h-4 w-4 rounded-full bg-white" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-6 py-5">
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            Mentions
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Get notified when someone mentions you
                                        </p>
                                    </div>

                                    <div className="h-5 w-9 rounded-full bg-indigo-500 p-0.5">
                                        <div className="ml-4 h-4 w-4 rounded-full bg-white" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.03]">
                            <div className="border-b border-red-500/10 px-6 py-5">
                                <p className="font-mono text-xs uppercase tracking-[0.18em] text-red-400">
                                    Danger Zone
                                </p>

                                <h2 className="mt-1 text-lg font-semibold text-slate-100">
                                    Delete Account
                                </h2>
                            </div>

                            <div className="px-6 py-5">
                                <p className="text-xs leading-relaxed text-slate-500">
                                    Permanently delete your account and remove
                                    your personal account data.
                                </p>

                                <button
                                    onClick={() => {
                                        setDeleteError("");
                                        setShowDeleteConfirm(true);
                                    }}
                                    className="mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                                >
                                    <Trash2 size={14} />
                                    Delete account
                                </button>
                            </div>
                        </section>
                    </div>
                </div>

                <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <div className="border-b border-slate-800/80 px-6 py-5">
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                            Workspace
                        </p>

                        <h2 className="mt-1 text-lg font-semibold">
                            Your Overview
                        </h2>
                    </div>

                    <div className="grid gap-px bg-slate-800/60 sm:grid-cols-3">
                        <div className="bg-slate-900/60 p-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Workspaces
                            </p>

                            <p className="mt-2 text-2xl font-semibold">04</p>

                            <p className="mt-1 text-xs text-slate-600">
                                Active memberships
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Projects
                            </p>

                            <p className="mt-2 text-2xl font-semibold">12</p>

                            <p className="mt-1 text-xs text-slate-600">
                                Across your workspaces
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Tasks
                            </p>

                            <p className="mt-2 text-2xl font-semibold">19</p>

                            <p className="mt-1 text-xs text-slate-600">
                                Currently pending
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {showEditForm && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                        onClick={closeEditForm}
                    />

                    <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-800 bg-slate-950 shadow-2xl shadow-black/40">
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        Edit Profile
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Update your personal information.
                                    </p>
                                </div>

                                <button
                                    onClick={closeEditForm}
                                    disabled={saving}
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form
                                onSubmit={handleUpdateProfile}
                                className="flex flex-1 flex-col"
                            >
                                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                                    {(editErrors.error ||
                                        editErrors.detail ||
                                        editErrors.message) && (
                                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                                {getErrorMessage(editErrors)}
                                            </div>
                                        )}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Username
                                        </label>

                                        <input
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            disabled={saving}
                                            className={`h-11 w-full rounded-xl border bg-slate-900/70 px-4 text-sm text-slate-100 outline-none transition focus:ring-1 ${editErrors.username
                                                    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
                                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/30"
                                                }`}
                                        />

                                        {editErrors.username && (
                                            <p className="mt-2 text-xs text-red-400">
                                                {editErrors.username}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            disabled={saving}
                                            className={`h-11 w-full rounded-xl border bg-slate-900/70 px-4 text-sm text-slate-100 outline-none transition focus:ring-1 ${editErrors.email
                                                    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
                                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/30"
                                                }`}
                                        />

                                        {editErrors.email && (
                                            <p className="mt-2 text-xs text-red-400">
                                                {editErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                First Name
                                            </label>

                                            <input
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                                disabled={saving}
                                                className={`h-11 w-full rounded-xl border bg-slate-900/70 px-4 text-sm text-slate-100 outline-none transition focus:ring-1 ${editErrors.first_name
                                                        ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
                                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/30"
                                                    }`}
                                            />

                                            {editErrors.first_name && (
                                                <p className="mt-2 text-xs text-red-400">
                                                    {editErrors.first_name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                Last Name
                                            </label>

                                            <input
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                                disabled={saving}
                                                className={`h-11 w-full rounded-xl border bg-slate-900/70 px-4 text-sm text-slate-100 outline-none transition focus:ring-1 ${editErrors.last_name
                                                        ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
                                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/30"
                                                    }`}
                                            />

                                            {editErrors.last_name && (
                                                <p className="mt-2 text-xs text-red-400">
                                                    {editErrors.last_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) =>
                                                setPhoneNumber(e.target.value)
                                            }
                                            disabled={saving}
                                            className={`h-11 w-full rounded-xl border bg-slate-900/70 px-4 text-sm text-slate-100 outline-none transition focus:ring-1 ${editErrors.phone_number
                                                    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
                                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/30"
                                                }`}
                                        />

                                        {editErrors.phone_number && (
                                            <p className="mt-2 text-xs text-red-400">
                                                {editErrors.phone_number}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Address
                                        </label>

                                        <textarea
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            disabled={saving}
                                            rows={4}
                                            className={`w-full resize-none rounded-xl border bg-slate-900/70 px-4 py-3 text-sm leading-relaxed text-slate-100 outline-none transition focus:ring-1 ${editErrors.address
                                                    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
                                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/30"
                                                }`}
                                        />

                                        {editErrors.address && (
                                            <p className="mt-2 text-xs text-red-400">
                                                {editErrors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Profile Picture
                                        </label>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            disabled={saving}
                                            className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-900/70 text-sm text-slate-400 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-slate-800 file:bg-slate-800 file:px-4 file:py-3 file:text-sm file:font-medium file:text-slate-200 hover:file:bg-slate-700"
                                        />

                                        {editErrors.profile_picture && (
                                            <p className="mt-2 text-xs text-red-400">
                                                {editErrors.profile_picture}
                                            </p>
                                        )}

                                        {profilePicturePreview && (
                                            <div className="mt-4">
                                                <img
                                                    src={profilePicturePreview}
                                                    alt="Profile preview"
                                                    className="h-20 w-20 rounded-xl border border-slate-800 object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-5">
                                    <button
                                        type="button"
                                        onClick={closeEditForm}
                                        disabled={saving}
                                        className="h-10 cursor-pointer rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="h-10 cursor-pointer rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                            <Trash2 size={20} />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-white">
                            Delete your account?
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                            This action is permanent. Your account and associated
                            personal information will be deleted.
                        </p>

                        {deleteError && (
                            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    if (!deleting) {
                                        setShowDeleteConfirm(false);
                                        setDeleteError("");
                                    }
                                }}
                                disabled={deleting}
                                className="h-10 cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteProfile}
                                disabled={deleting}
                                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 size={15} />
                                {deleting ? "Deleting..." : "Delete account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}