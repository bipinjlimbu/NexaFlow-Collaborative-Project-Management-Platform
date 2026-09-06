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

export async function register(data: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    profile_picture: string;
}) {
    return apiFetch("/register/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function logout(refresh: string) {
    return apiFetch("/logout/", {
        method: "POST",
        body: JSON.stringify({
            refresh,
        }),
    });
}