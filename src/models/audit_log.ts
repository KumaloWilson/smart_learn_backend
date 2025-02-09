export interface AuditLog {
    log_id: string;
    admin_id: string;
    action_type: string;
    module: string;
    action_description: string;
    affected_record_id?: string;
    affected_table?: string;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    timestamp: string;
}
