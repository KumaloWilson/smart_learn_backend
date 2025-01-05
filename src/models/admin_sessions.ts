export interface AdminSession {
    session_id: string;
    admin_id: string;
    session_token: string;
    ip_address: string;
    user_agent?: string;
    login_timestamp?: string;
    last_activity?: string;
    logout_timestamp?: string;
    session_status: 'active' | 'expired' | 'logged_out';
}
