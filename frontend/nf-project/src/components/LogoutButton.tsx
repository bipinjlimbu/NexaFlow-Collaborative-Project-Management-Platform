"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        const refresh = localStorage.getItem("refresh");

        if (refresh) {
            try {
                await logout(refresh);
            } catch { }
        }

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        router.push("/login");
    }

    return (
        <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
            Logout
        </button>
    );
}