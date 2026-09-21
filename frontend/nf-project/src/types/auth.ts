import type { User } from "./user";

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
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
