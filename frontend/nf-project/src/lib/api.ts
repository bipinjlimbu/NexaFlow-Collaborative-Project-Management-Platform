const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
    endpoint: string,
    options?: RequestInit
) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw {
            ...data,
            status: response.status,
        };
    }

    return data;
}

export async function authFetch(
    endpoint: string,
    options?: RequestInit
) {
    const access = localStorage.getItem("access");

    if (!access) {
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-change"));
        window.location.href = "/login";
        throw new Error("Authentication required");
    }

    try {
        return await apiFetch(endpoint, {
            ...options,
            headers: {
                ...options?.headers,
                Authorization: `Bearer ${access}`,
            },
        });
    } catch (error: any) {
        if (error?.status === 401) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");

            window.dispatchEvent(new Event("auth-change"));
            window.location.href = "/login";
        }

        throw error;
    }
}