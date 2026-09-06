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

        window.dispatchEvent(new Event("auth-change"));

        router.push("/login");
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
            Logout
        </button>
    );
}