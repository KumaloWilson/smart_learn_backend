CREATE TABLE IF NOT EXISTS lecturer_course_assignments (
    assignment_id VARCHAR(50) PRIMARY KEY,
    lecturer_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester ENUM('fall', 'spring', 'summer') NOT NULL,
    role ENUM('primary', 'assistant', 'guest') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);