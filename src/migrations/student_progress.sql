CREATE TABLE IF NOT EXISTS student_progress (
    progress_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    subtopic_id VARCHAR(36) NOT NULL,
    mastery_level DECIMAL(5,2) NOT NULL, -- Percentage
    attempts_count INT DEFAULT 0,
    last_attempt_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);