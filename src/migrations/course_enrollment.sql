CREATE TABLE IF NOT EXISTS student_course_enrollments (
    enrollment_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    semester ENUM('1', '2') NOT NULL,
    enrollment_date DATE NOT NULL,
    grade VARCHAR(2),
    grade_points DECIMAL(3,2),
    attendance_percentage DECIMAL(5,2),
    status ENUM('enrolled', 'withdrawn', 'completed', 'failed') DEFAULT 'enrolled',
    is_retake BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
