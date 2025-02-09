-- Create virtual_classes table
CREATE TABLE IF NOT EXISTS virtual_classes (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    topic_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    meeting_link VARCHAR(255) NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50),
    status ENUM('scheduled', 'in-progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES course_topics(topic_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES lecturers(lecturer_id) ON DELETE CASCADE
    );

