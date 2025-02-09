CREATE TABLE IF NOT EXISTS course_topics (
    topic_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    topic_name VARCHAR(255) NOT NULL,
    topic_number INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);
