"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import LogoutButton from "@/components/LogoutButton";
import { deleteProfile, updateProfile } from "@/services/profileService";
import { Bell, Pencil, Trash2, X } from "lucide-react";

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
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                        <Link
                            href="/dashboard"
                            className="transition hover:text-slate-300"
                        >
                            Dashboard
                        </Link>
                        <span className="text-slate-700">/</span>
                        <span className="text-slate-300">Profile</span>
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                Account
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Your Profile
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                                Manage your personal information and profile details.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <LogoutButton />

                            <button
                                onClick={openEditForm}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
                            >
                                <Pencil size={15} />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-2xl shadow-black/10">
                    <div className="relative h-32 overflow-hidden border-b border-slate-800 bg-[#0F172A]">
                        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                        <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-sky-500/5 blur-3xl" />
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-indigo-500/20" />
                    </div>

                    <div className="px-5 pb-7 sm:px-7 lg:px-8">
                        <div className="flex flex-col gap-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                {user.profile_picture ? (
                                    <img
                                        src={profileImage}
                                        alt={fullName}
                                        className="h-24 w-24 shrink-0 rounded-2xl border-4 border-[#111827] object-cover shadow-xl"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-[#111827] bg-indigo-500 text-2xl font-semibold text-white shadow-xl">
                                        {initials}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <h2 className="truncate text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                        {fullName}
                                    </h2>

                                    <p className="mt-1 truncate text-sm text-slate-400">
                                        @{user.username || "user"}
                                    </p>
                                </div>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-xs font-semibold text-emerald-400">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]">
                        <div className="border-b border-slate-800 px-5 py-5 sm:px-7">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                        Personal Information
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold text-slate-50">
                                        Account Details
                                    </h2>
                                </div>

                                <button
                                    onClick={openEditForm}
                                    className="hidden h-9 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:inline-flex"
                                >
                                    <Pencil size={14} />
                                    Edit
                                </button>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2">
                            <div className="border-b border-slate-800 p-5 sm:border-r sm:px-7">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    First Name
                                </p>
                                <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                    {user.first_name || "Not provided"}
                                </p>
                            </div>

                            <div className="border-b border-slate-800 p-5 sm:px-7">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Last Name
                                </p>
                                <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                    {user.last_name || "Not provided"}
                                </p>
                            </div>

                            <div className="border-b border-slate-800 p-5 sm:border-r sm:px-7">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Username
                                </p>
                                <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                    {user.username || "Not provided"}
                                </p>
                            </div>

                            <div className="border-b border-slate-800 p-5 sm:px-7">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Email
                                </p>
                                <p className="mt-2 break-all text-sm font-medium text-slate-200">
                                    {user.email || "Not provided"}
                                </p>
                            </div>

                            <div className="border-b border-slate-800 p-5 sm:border-r sm:px-7">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Phone Number
                                </p>
                                <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                    {user.phone_number || "Not provided"}
                                </p>
                            </div>

                            <div className="border-b border-slate-800 p-5 sm:px-7">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Address
                                </p>
                                <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-200">
                                    {user.address || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="flex h-fit flex-col gap-4">
                        <section className="overflow-hidden rounded-3xl border border-indigo-500/20 bg-[#111827]">
                            <div className="border-b border-indigo-500/10 bg-indigo-500/[0.03] px-5 py-5 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                                        <Bell size={18} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                            Workspace
                                        </p>

                                        <h2 className="mt-1 text-lg font-semibold text-slate-100">
                                            Invitations
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <p className="text-sm leading-6 text-slate-400">
                                    View and manage workspace invitations sent to
                                    your account.
                                </p>

                                <Link
                                    href="/invitations"
                                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
                                >
                                    <Bell size={15} />
                                    View Invitations
                                </Link>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-3xl border border-rose-500/20 bg-[#111827]">
                            <div className="border-b border-rose-500/10 bg-rose-500/[0.03] px-5 py-5 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                                        <Trash2 size={18} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-400">
                                            Danger Zone
                                        </p>

                                        <h2 className="mt-1 text-lg font-semibold text-slate-100">
                                            Delete Account
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <p className="text-sm leading-6 text-slate-400">
                                    Permanently delete your account and remove
                                    your personal account data.
                                </p>

                                <button
                                    onClick={() => {
                                        setDeleteError("");
                                        setShowDeleteConfirm(true);
                                    }}
                                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20"
                                >
                                    <Trash2 size={15} />
                                    Delete account
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {showEditForm && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
                        onClick={closeEditForm}
                    />

                    <div className="absolute right-0 top-0 h-full w-full max-w-lg border-l border-slate-800 bg-[#020617] shadow-2xl shadow-black/50">
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5 sm:px-6">
                                <div>
                                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                                        Account
                                    </div>

                                    <h2 className="text-xl font-semibold text-white">
                                        Edit Profile
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Update your personal information.
                                    </p>
                                </div>

                                <button
                                    onClick={closeEditForm}
                                    disabled={saving}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] text-slate-400 transition hover:border-slate-700 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form
                                onSubmit={handleUpdateProfile}
                                className="flex min-h-0 flex-1 flex-col"
                            >
                                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
                                    {(editErrors.error ||
                                        editErrors.detail ||
                                        editErrors.message) && (
                                            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-5 text-rose-400">
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
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:ring-2 ${editErrors.username
                                                    ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        {editErrors.username && (
                                            <p className="mt-2 text-xs text-rose-400">
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
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition focus:ring-2 ${editErrors.email
                                                    ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        {editErrors.email && (
                                            <p className="mt-2 text-xs text-rose-400">
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
                                                className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition focus:ring-2 ${editErrors.first_name
                                                        ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                    }`}
                                            />

                                            {editErrors.first_name && (
                                                <p className="mt-2 text-xs text-rose-400">
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
                                                className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition focus:ring-2 ${editErrors.last_name
                                                        ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                        : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                    }`}
                                            />

                                            {editErrors.last_name && (
                                                <p className="mt-2 text-xs text-rose-400">
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
                                            className={`h-11 w-full rounded-xl border bg-[#0F172A] px-4 text-sm text-slate-100 outline-none transition focus:ring-2 ${editErrors.phone_number
                                                    ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        {editErrors.phone_number && (
                                            <p className="mt-2 text-xs text-rose-400">
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
                                            className={`w-full resize-none rounded-xl border bg-[#0F172A] px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition focus:ring-2 ${editErrors.address
                                                    ? "border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10"
                                                    : "border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/10"
                                                }`}
                                        />

                                        {editErrors.address && (
                                            <p className="mt-2 text-xs text-rose-400">
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
                                            className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-[#0F172A] text-sm text-slate-400 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-slate-800 file:bg-slate-800 file:px-4 file:py-3 file:text-sm file:font-medium file:text-slate-200 hover:file:bg-slate-700"
                                        />

                                        {editErrors.profile_picture && (
                                            <p className="mt-2 text-xs text-rose-400">
                                                {editErrors.profile_picture}
                                            </p>
                                        )}

                                        {profilePicturePreview && (
                                            <div className="mt-4 flex items-center gap-3">
                                                <img
                                                    src={profilePicturePreview}
                                                    alt="Profile preview"
                                                    className="h-20 w-20 rounded-2xl border border-slate-800 object-cover"
                                                />

                                                <div>
                                                    <p className="text-sm font-medium text-slate-200">
                                                        New profile picture
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Preview before saving
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-[#020617] px-5 py-4 sm:px-6">
                                    <button
                                        type="button"
                                        onClick={closeEditForm}
                                        disabled={saving}
                                        className="h-10 rounded-xl border border-slate-800 bg-[#0F172A] px-4 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="h-10 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-2xl shadow-black/50 sm:p-7">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                            <Trash2 size={20} />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-white">
                            Delete your account?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            This action is permanent. Your account and associated
                            personal information will be deleted.
                        </p>

                        {deleteError && (
                            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-5 text-rose-400">
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => {
                                    if (!deleting) {
                                        setShowDeleteConfirm(false);
                                        setDeleteError("");
                                    }
                                }}
                                disabled={deleting}
                                className="h-10 rounded-xl border border-slate-800 bg-[#0F172A] px-4 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteProfile}
                                disabled={deleting}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
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