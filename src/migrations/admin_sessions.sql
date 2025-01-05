CREATE TABLE IF NOT EXISTS admin_sessions (
    session_id VARCHAR(50) PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP,
    logout_timestamp TIMESTAMP,
    session_status ENUM('active', 'expired', 'logged_out') DEFAULT 'active'
);
