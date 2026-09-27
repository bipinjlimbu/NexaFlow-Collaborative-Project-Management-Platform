"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    acceptInvitation,
    declineInvitation,
    getInvitations,
} from "@/services/invitationService";
import type { WorkspaceInvitation } from "@/types/invitation";
import InvitationsSkeleton from "@/components/InvitationsSkeleton";

function getRoleStyle(role: string) {
    switch (role.toLowerCase()) {
        case "admin":
            return "border-indigo-500/20 bg-indigo-500/10 text-indigo-400";
        case "member":
            return "border-sky-500/20 bg-sky-500/10 text-sky-400";
        default:
            return "border-slate-700 bg-slate-800/70 text-slate-400";
    }
}

function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
        case "pending":
            return "border-amber-500/20 bg-amber-500/10 text-amber-400";
        case "accepted":
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
        case "declined":
            return "border-rose-500/20 bg-rose-500/10 text-rose-400";
        case "expired":
            return "border-slate-700 bg-slate-800/70 text-slate-500";
        default:
            return "border-slate-700 bg-slate-800/70 text-slate-400";
    }
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatRelativeDate(date: string) {
    const invitationDate = new Date(date);
    const now = new Date();

    const difference =
        now.getTime() - invitationDate.getTime();

    const seconds = Math.floor(difference / 1000);

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return formatDate(date);
}

export default function InvitationsPage() {
    const router = useRouter();

    const [invitations, setInvitations] = useState<
        WorkspaceInvitation[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [acceptingId, setAcceptingId] = useState<number | null>(
        null
    );
    const [decliningId, setDecliningId] = useState<number | null>(
        null
    );

    useEffect(() => {
        const access = localStorage.getItem("access");

        if (!access) {
            router.replace("/login");
            return;
        }

        async function loadInvitations() {
            try {
                setLoading(true);
                setError("");

                const data = await getInvitations();

                setInvitations(data);
            } catch (err: any) {
                if (err && typeof err === "object") {
                    const messages = Object.values(err)
                        .filter(
                            (message) =>
                                typeof message === "string"
                        )
                        .join(" ");

                    setError(
                        messages ||
                        "Unable to load invitations."
                    );
                } else {
                    setError("Unable to load invitations.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadInvitations();
    }, [router]);

    const handleAcceptInvitation = async (id: number) => {
        try {
            setAcceptingId(id);
            setError("");

            const updatedInvitation =
                await acceptInvitation(id);

            setInvitations((currentInvitations) =>
                currentInvitations.map((invitation) =>
                    invitation.id === updatedInvitation.id
                        ? updatedInvitation
                        : invitation
                )
            );
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .filter(
                        (message) =>
                            typeof message === "string"
                    )
                    .join(" ");

                setError(
                    messages ||
                    "Unable to accept invitation."
                );
            } else {
                setError("Unable to accept invitation.");
            }
        } finally {
            setAcceptingId(null);
        }
    };

    const handleDeclineInvitation = async (id: number) => {
        try {
            setDecliningId(id);
            setError("");

            const updatedInvitation =
                await declineInvitation(id);

            setInvitations((currentInvitations) =>
                currentInvitations.map((invitation) =>
                    invitation.id === updatedInvitation.id
                        ? updatedInvitation
                        : invitation
                )
            );
        } catch (err: any) {
            if (err && typeof err === "object") {
                const messages = Object.values(err)
                    .filter(
                        (message) =>
                            typeof message === "string"
                    )
                    .join(" ");

                setError(
                    messages ||
                    "Unable to decline invitation."
                );
            } else {
                setError("Unable to decline invitation.");
            }
        } finally {
            setDecliningId(null);
        }
    };

    if (loading) {
        return <InvitationsSkeleton />;
    }

    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <button
                    onClick={() => router.back()}
                    className="mb-7 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-200"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back
                </button>

                <section className="mb-8 rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-2xl shadow-black/20 sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                Workspace access
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Invitations
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                                Manage workspace invitations sent to
                                you.
                            </p>
                        </div>

                        {invitations.length > 0 && (
                            <div className="flex h-10 w-fit items-center gap-2 rounded-xl border border-slate-800 bg-[#0F172A] px-3.5 text-sm font-medium text-slate-300">
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500/10 px-1.5 text-xs font-semibold text-indigo-400">
                                    {invitations.length}
                                </span>
                                {invitations.length === 1
                                    ? "Invitation"
                                    : "Invitations"}
                            </div>
                        )}
                    </div>
                </section>

                {error && (
                    <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/[0.05] px-5 py-4">
                        <div className="flex items-start gap-3 text-sm text-rose-400">
                            <svg
                                className="mt-0.5 h-4 w-4 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v3.5m0 3h.01M10.29 3.86l-7.17 12a2 2 0 001.71 3h14.34a2 2 0 001.71-3l-7.17-12a2 2 0 00-3.42 0z"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {!error && invitations.length === 0 && (
                    <section className="rounded-3xl border border-slate-800 bg-[#111827] px-6 py-20 text-center shadow-2xl shadow-black/10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-[#0F172A] text-slate-500">
                            <svg
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-slate-200">
                            No invitations
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            You don&apos;t have any workspace
                            invitations right now.
                        </p>
                    </section>
                )}

                {invitations.length > 0 && (
                    <div className="space-y-4">
                        {invitations.map((invitation) => {
                            const inviter =
                                invitation.invited_by;

                            const isAccepting =
                                acceptingId === invitation.id;

                            const isDeclining =
                                decliningId === invitation.id;

                            const isProcessing =
                                isAccepting || isDeclining;

                            return (
                                <article
                                    key={invitation.id}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] transition duration-200 hover:border-slate-700 hover:bg-[#151e2f]"
                                >
                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-500/70 opacity-60 transition-opacity group-hover:opacity-100" />

                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex min-w-0 gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-base font-bold text-indigo-400">
                                                    {invitation.workspace.name
                                                        .slice(0, 1)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2.5">
                                                        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
                                                            {
                                                                invitation
                                                                    .workspace
                                                                    .name
                                                            }
                                                        </h2>

                                                        <span
                                                            className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${getStatusStyle(
                                                                invitation.status
                                                            )}`}
                                                        >
                                                            {
                                                                invitation.status
                                                            }
                                                        </span>
                                                    </div>

                                                    {invitation.workspace
                                                        .description && (
                                                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                                                {
                                                                    invitation
                                                                        .workspace
                                                                        .description
                                                                }
                                                            </p>
                                                        )}

                                                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <svg
                                                                className="h-3.5 w-3.5 text-slate-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="1.8"
                                                                    d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            Invited{" "}
                                                            {formatRelativeDate(
                                                                invitation.created_at
                                                            )}
                                                        </span>

                                                        <span className="inline-flex items-center gap-1.5">
                                                            <svg
                                                                className="h-3.5 w-3.5 text-slate-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="1.8"
                                                                    d="M12 8v4l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            Expires{" "}
                                                            {formatDate(
                                                                invitation.expires_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <span
                                                className={`w-fit rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize ${getRoleStyle(
                                                    invitation.role
                                                )}`}
                                            >
                                                {invitation.role}
                                            </span>
                                        </div>

                                        <div className="mt-5 flex flex-col gap-4 border-t border-slate-800/70 pt-4 sm:flex-row sm:items-center">
                                            <div className="flex min-w-0 items-center gap-3">
                                                {inviter.profile_picture ? (
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace(
                                                            "/api",
                                                            ""
                                                        )}${inviter.profile_picture}`}
                                                        alt={
                                                            inviter.first_name ||
                                                            inviter.username
                                                        }
                                                        className="h-9 w-9 shrink-0 rounded-full border border-slate-700 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500 text-xs font-semibold text-white">
                                                        {inviter.first_name?.[0]?.toUpperCase() ||
                                                            inviter.username?.[0]?.toUpperCase() ||
                                                            "U"}
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                                                        Invited by
                                                    </p>

                                                    <p className="truncate text-sm font-medium text-slate-300">
                                                        {inviter.first_name ||
                                                            inviter.username}{" "}
                                                        {inviter.last_name ||
                                                            ""}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-xs text-slate-600 sm:ml-auto">
                                                @{inviter.username}
                                            </span>
                                        </div>

                                        {invitation.status ===
                                            "pending" && (
                                                <div className="mt-5 flex flex-col gap-2 border-t border-slate-800/70 pt-5 sm:flex-row sm:justify-end">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        onClick={() =>
                                                            handleDeclineInvitation(
                                                                invitation.id
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/[0.06] hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {isDeclining
                                                            ? "Declining..."
                                                            : "Decline"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        onClick={() =>
                                                            handleAcceptInvitation(
                                                                invitation.id
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/15 transition hover:bg-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isAccepting
                                                            ? "Accepting..."
                                                            : "Accept invitation"}
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}