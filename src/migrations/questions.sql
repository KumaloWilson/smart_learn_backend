
CREATE TABLE IF NOT EXISTS questions (
    attempt_id VARCHAR(36),
    question_id VARCHAR(36) PRIMARY KEY,
    text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    misconception TEXT,
    points INT NOT NULL,
    type ENUM('multiple_choice', 'true_false', 'matching') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
