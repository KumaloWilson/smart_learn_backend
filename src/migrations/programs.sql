CREATE TABLE IF NOT EXISTS programs (
    program_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50),
    program_name VARCHAR(255) NOT NULL,
    program_code VARCHAR(20) UNIQUE,
    degree_level ENUM('certificate', 'diploma', 'bachelor', 'master', 'doctorate'),
    duration_years DECIMAL(3,1),
    credit_hours INT,
    description TEXT,
    coordinator_id VARCHAR(50),
    accreditation_status VARCHAR(50),
    entry_requirements TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);