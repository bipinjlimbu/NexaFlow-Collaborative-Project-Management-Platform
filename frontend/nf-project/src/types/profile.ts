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
