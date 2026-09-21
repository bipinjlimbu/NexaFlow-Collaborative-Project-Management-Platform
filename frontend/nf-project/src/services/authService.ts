import { apiFetch } from "@/lib/api";
import type {
    LoginResponse,
    RegisterData,
    RegisterResponse,
} from "@/types/auth";

export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {
    return apiFetch("/login/", {
        method: "POST",
        body: JSON.stringify({
            username,
            password,
        }),
    });
}

export async function register(
    data: RegisterData
): Promise<RegisterResponse> {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirm_password", data.confirm_password);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("phone_number", data.phone_number);
    formData.append("address", data.address);

    if (data.profile_picture) {
        formData.append("profile_picture", data.profile_picture);
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL} /register/`,
        {
            method: "POST",
            body: formData,
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    return result;

}

export async function logout(refresh: string) {
    return apiFetch("/logout/", {
        method: "POST",
        body: JSON.stringify({
            refresh,
        }),
    });
}
