CREATE TABLE IF NOT EXISTS programs (
    program_id VARCHAR(50) PRIMARY KEY,
    school_id VARCHAR(50),
    program_name VARCHAR(255) NOT NULL,
    program_code VARCHAR(20) UNIQUE,
    degree_level ENUM('certificate', 'diploma', 'bachelor', 'master', 'doctorate'),
    duration_years INT,
    credit_hours INT,
    description TEXT,
    coordinator_id VARCHAR(50),
    accreditation_status TEXT,
    entry_requirements TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);