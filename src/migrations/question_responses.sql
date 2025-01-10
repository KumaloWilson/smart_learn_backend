CREATE TABLE IF NOT EXISTS question_responses (
    response_id VARCHAR(36) PRIMARY KEY,
    attempt_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    student_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INT, -- in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);