CREATE TABLE IF NOT EXISTS departments (
    department_id VARCHAR(50) PRIMARY KEY ,
    school_id VARCHAR(50),
    department_name VARCHAR(255) NOT NULL,
    department_code VARCHAR(20) UNIQUE,
    head_of_department_id VARCHAR(50),
    establishment_date DATE,
    description TEXT,
    office_location VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);