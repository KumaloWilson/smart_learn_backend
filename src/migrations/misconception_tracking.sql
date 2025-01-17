
CREATE TABLE IF NOT EXISTS misconception_tracking (
    tracking_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    subtopic_id VARCHAR(36) NOT NULL,
    misconception_type VARCHAR(255) NOT NULL,
    frequency INT DEFAULT 1,
    last_occurrence TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
