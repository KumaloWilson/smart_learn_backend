
CREATE TABLE IF NOT EXISTS quiz_attempts (
    attempt_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    quiz_id VARCHAR(36) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    score DECIMAL(5,2),
    status ENUM('in_progress', 'completed', 'abandoned') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
