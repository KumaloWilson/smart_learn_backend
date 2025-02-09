CREATE TABLE IF NOT EXISTS lecturer_qualifications (
    lecturer_qualification_id VARCHAR(50) PRIMARY KEY,
    lecturer_id VARCHAR(50) NOT NULL,
    qualification_id VARCHAR(50) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    year_obtained YEAR NOT NULL,
    field_of_study VARCHAR(255) NOT NULL,
    document_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
