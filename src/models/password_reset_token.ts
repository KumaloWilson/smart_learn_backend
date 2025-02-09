export interface PasswordResetToken {
    token_id: string;
    admin_id: string;
    reset_token: string;
    created_at: string;
    expires_at: string;
    used: boolean;
}
