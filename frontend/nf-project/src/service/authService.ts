import { apiFetch } from "@/lib/api";

export async function login(
    username: string,
    password: string
) {
    return apiFetch("/login/", {
        method: "POST",
        body: JSON.stringify({
            username,
            password,
        }),
    });
}
