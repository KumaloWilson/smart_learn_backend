CREATE TABLE IF NOT EXISTS schools (
    school_id VARCHAR(50) PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    school_code VARCHAR(20) UNIQUE,
    dean_id VARCHAR(50),
    establishment_date DATE,
    description TEXT,
    building_location VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
