import { authFetch } from "@/lib/api";

export interface UpdateProfileData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    profile_picture?: File | null;
}

export interface ProfileError {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    address?: string;
    profile_picture?: string;
    error?: string;
    detail?: string;
    message?: string;
}

export async function updateProfile(
    data: UpdateProfileData
) {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("phone_number", data.phone_number);
    formData.append("address", data.address);

    if (data.profile_picture) {
        formData.append("profile_picture", data.profile_picture);
    }

    const access = localStorage.getItem("access");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL} /profile/`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${access} `,
            },
            body: formData,
        }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw result as ProfileError;
    }

    return result;
}

export async function deleteProfile() {
    return authFetch("/profile/", {
        method: "DELETE",
    });
}