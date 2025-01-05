CREATE TABLE IF NOT EXISTS lecturer_department_affiliations (
    affiliation_id VARCHAR(50) PRIMARY KEY,
    lecturer_id VARCHAR(50) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
