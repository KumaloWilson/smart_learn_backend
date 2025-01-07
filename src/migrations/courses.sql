CREATE TABLE IF NOT EXISTS courses (
    course_id  VARCHAR(50) PRIMARY KEY,
    program_id VARCHAR(50),
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(20) UNIQUE,
    period_id VARCHAR(50),
    phase INT,
    credit_hours INT,
    description TEXT,
    prerequisites TEXT,
    semester_offered ENUM('fall', 'spring', 'summer', 'all'),
    course_level VARCHAR(3),
    is_elective BOOLEAN DEFAULT FALSE,
    syllabus_path VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);