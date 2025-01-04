CREATE TABLE IF NOT EXISTS lecturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email_address VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    office_address VARCHAR(100),
    date_of_birth DATE,
    nationality VARCHAR(50),
    sex ENUM('MALE', 'FEMALE', 'OTHER'),
    department_id VARCHAR(100),
    faculty_id VARCHAR(100),
    title VARCHAR(20),
    joined_date DATE DEFAULT CURRENT_DATE
);