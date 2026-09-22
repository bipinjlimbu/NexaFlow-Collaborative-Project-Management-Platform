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
            return "border-indigo-400/20 bg-indigo-500/10 text-indigo-300";
        case "member":
            return "border-sky-400/20 bg-sky-500/10 text-sky-300";
        default:
            return "border-slate-700 bg-slate-800/70 text-slate-400";
    }
}

function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
        case "pending":
            return "border-amber-400/20 bg-amber-500/10 text-amber-300";
        case "accepted":
            return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
        case "declined":
            return "border-red-400/20 bg-red-500/10 text-red-300";
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
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="mb-7 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-200"
                    >
                        <span className="text-base">←</span>
                        Back
                    </button>

                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Invitations
                        </h1>

                        {invitations.length > 0 && (
                            <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 text-xs font-semibold text-indigo-300">
                                {invitations.length}
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage workspace invitations sent to you.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {!error && invitations.length === 0 && (
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 px-6 py-20 text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-xl text-slate-500">
                            ✉
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-slate-200">
                            No invitations
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            You don&apos;t have any workspace invitations
                            right now.
                        </p>
                    </div>
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
                                <div
                                    key={invitation.id}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-[1px] hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)]"
                                >
                                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-indigo-500/70 via-indigo-500/20 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />

                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex min-w-0 gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-base font-bold text-indigo-300 shadow-inner shadow-indigo-500/5">
                                                    {invitation.workspace.name
                                                        .slice(0, 1)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2.5">
                                                        <h2 className="truncate text-lg font-semibold tracking-tight text-white">
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
                                                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                                                {
                                                                    invitation
                                                                        .workspace
                                                                        .description
                                                                }
                                                            </p>
                                                        )}

                                                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="text-slate-700">
                                                                ◷
                                                            </span>
                                                            Invited{" "}
                                                            {formatRelativeDate(
                                                                invitation.created_at
                                                            )}
                                                        </span>

                                                        <span className="flex items-center gap-1.5">
                                                            <span className="text-slate-700">
                                                                ⌛
                                                            </span>
                                                            Expires{" "}
                                                            {formatDate(
                                                                invitation.expires_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <span
                                                className={`self-start rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize ${getRoleStyle(
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
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-600 text-xs font-semibold text-white">
                                                        {inviter.first_name?.[0]?.toUpperCase() ||
                                                            inviter.username?.[0]?.toUpperCase() ||
                                                            "U"}
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
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

                                            <span className="hidden text-xs text-slate-700 sm:ml-auto sm:block">
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
                                                        className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-red-500/30 hover:bg-red-500/[0.06] hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                                                        className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isAccepting
                                                            ? "Accepting..."
                                                            : "Accept invitation"}
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}