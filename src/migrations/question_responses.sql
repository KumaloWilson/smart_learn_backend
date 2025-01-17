CREATE TABLE IF NOT EXISTS question_responses (
    response_id VARCHAR(36) PRIMARY KEY,
    attempt_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    student_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INT,
    points_earned INT NOT NULL DEFAULT 0,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attempt_id (attempt_id),
    INDEX idx_question_id (question_id)
);