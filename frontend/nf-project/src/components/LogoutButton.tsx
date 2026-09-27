"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";
import { LogOut } from "lucide-react";

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
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#0F172A] px-4 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
            <LogOut size={15} />
            Logout
        </button>
    );
}