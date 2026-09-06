import { authFetch } from "@/lib/api";

export async function getCurrentUser() {
    return authFetch("/profile/");
}