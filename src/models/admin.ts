export interface Admin {
    id?: number; // Optional because it's auto-generated
    uid: string;
    name: string;
    email: string;
    phone_number?: string;
    address?: string;
    is_active?: boolean;
    role?: 'admin' | 'superadmin';
    profile_picture_url?: string;
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date | null;
}
