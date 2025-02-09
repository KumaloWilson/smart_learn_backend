CREATE TABLE IF NOT EXISTS virtual_class_attendees (
                                                       id VARCHAR(36) PRIMARY KEY,
    virtual_class_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    join_time DATETIME NOT NULL,
    leave_time DATETIME,
    attendance_duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (virtual_class_id) REFERENCES virtual_classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    );
