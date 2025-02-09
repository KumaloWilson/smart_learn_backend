CREATE TABLE IF NOT EXISTS qualification_types (
    qualification_id VARCHAR(50) PRIMARY KEY,
    qualification_name VARCHAR(100) NOT NULL,
    level ENUM('bachelor', 'master', 'doctorate', 'professional') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
