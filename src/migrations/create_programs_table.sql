
CREATE TABLE IF NOT EXISTS programme (
    programme_id VARCHAR(50) PRIMARY KEY,
    faculty_id VARCHAR(50),
    attendance_type_name VARCHAR(255),
    programme_name VARCHAR(255),
    programme_code VARCHAR(255),
    faculty_name VARCHAR(255),
    faculty_code VARCHAR(255),
    level VARCHAR(255),
    completed BOOLEAN
);