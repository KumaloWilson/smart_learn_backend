
CREATE TABLE IF NOT EXISTS system_audit_logs (
    log_id VARCHAR(50) PRIMARY KEY,
    admin_id VARCHAR(50),
    action_type VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    action_description TEXT NOT NULL,
    affected_record_id VARCHAR(50),
    affected_table VARCHAR(50),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);