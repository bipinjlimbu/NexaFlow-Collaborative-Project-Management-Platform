export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string | null;
    address: string | null;
    profile_picture: string | null;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    last_login: string | null;
}
