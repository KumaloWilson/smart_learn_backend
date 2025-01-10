CREATE TABLE IF NOT EXISTS topics (
    topic_id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE IF NOT EXISTS subtopics (
    subtopic_id VARCHAR(36) PRIMARY KEY,
    topic_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    learning_objectives TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
);

CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id VARCHAR(36) PRIMARY KEY,
    subtopic_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit INT, -- in minutes
    passing_score INT,
    max_attempts INT,
    is_practice BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(subtopic_id)
);

CREATE TABLE IF NOT EXISTS questions (
    question_id VARCHAR(36) PRIMARY KEY,
    quiz_id VARCHAR(36) NOT NULL,
    text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    hint TEXT,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    misconception TEXT,
    points INT NOT NULL,
    time_estimate INT NOT NULL,
    tags JSON,
    type ENUM('multiple_choice', 'true_false', 'matching') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id)
);

-- Quiz attempts and analytics
CREATE TABLE IF NOT EXISTS quiz_attempts (
    attempt_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    quiz_id VARCHAR(36) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    score DECIMAL(5,2),
    status ENUM('in_progress', 'completed', 'abandoned') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id)
);

CREATE TABLE IF NOT EXISTS question_responses (
    response_id VARCHAR(36) PRIMARY KEY,
    attempt_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    student_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INT, -- in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(attempt_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

-- Learning analytics
CREATE TABLE IF NOT EXISTS student_progress (
    progress_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    subtopic_id VARCHAR(36) NOT NULL,
    mastery_level DECIMAL(5,2) NOT NULL, -- Percentage
    attempts_count INT DEFAULT 0,
    last_attempt_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(subtopic_id)
);

CREATE TABLE misconception_tracking (
    tracking_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    subtopic_id VARCHAR(36) NOT NULL,
    misconception_type VARCHAR(255) NOT NULL,
    frequency INT DEFAULT 1,
    last_occurrence TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(subtopic_id)
);
