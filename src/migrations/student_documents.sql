CREATE TABLE IF NOT EXISTS student_documents (
    document_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    document_type ENUM('transcript', 'certificate', 'id_card', 'medical_record', 'other') NOT NULL,
    document_number VARCHAR(50),
    document_url VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);