import type { User } from "./user";

export interface LoginResponse {
    message: string;
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    profile_picture: File | null;
}

export interface RegisterResponse {
    message?: string;
    user?: User;
    access?: string;
    refresh?: string;
}