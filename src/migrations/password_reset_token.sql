CREATE TABLE password_reset_tokens (
    token_id VARCHAR(50) PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL,
    reset_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);