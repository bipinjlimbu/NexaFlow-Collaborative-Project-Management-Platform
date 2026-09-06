"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";

type LogoutButtonProps = {
    onLogout: () => void;
};

export default function LogoutButton({
    onLogout,
}: LogoutButtonProps) {
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

        onLogout();

        router.push("/login");
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
        >
            Logout
        </button>
    );
}