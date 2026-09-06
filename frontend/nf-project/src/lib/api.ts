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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
    }

    return data;
}

export async function authFetch(
    endpoint: string,
    options?: RequestInit
) {
    const access = localStorage.getItem("access");

    return apiFetch(endpoint, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${access}`,
        },
    });
}