CREATE TABLE IF NOT EXISTS student_academic_records (
    record_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    program_id VARCHAR(50) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    semester ENUM('1', '2') NOT NULL,
    level VARCHAR(5) NOT NULL,
    gpa DECIMAL(3,2),
    cgpa DECIMAL(3,2),
    total_credits_earned INT,
    academic_standing ENUM('good', 'warning', 'probation', 'dismissed'),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
