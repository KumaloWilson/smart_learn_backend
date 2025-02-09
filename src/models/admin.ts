export interface Admin {
    admin_id: string;
    role_id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    last_login?: string;
    failed_login_attempts: number;
    account_locked: boolean;
    lock_timestamp?: string;
    status: 'active' | 'inactive' | 'suspended';
    created_at?: string;
    updated_at?: string;
}
