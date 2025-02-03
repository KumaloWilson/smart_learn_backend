CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    subtopic VARCHAR(255),
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    creator_role ENUM('lecturer', 'student') NOT NULL,
    total_questions INT NOT NULL,
    time_limit INT,
    passing_score INT,
    status ENUM('draft', 'active', 'archived') NOT NULL DEFAULT 'draft',
    learning_objectives JSON,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    visibility ENUM('private', 'public') NOT NULL DEFAULT 'private'
);
