-- Create virtual_class_resources table
CREATE TABLE IF NOT EXISTS virtual_class_resources (
    id VARCHAR(36) PRIMARY KEY,
    virtual_class_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(255),
    resource_type ENUM('document', 'presentation', 'link', 'other') NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (virtual_class_id) REFERENCES virtual_classes(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES lecturers(lecturer_id) ON DELETE CASCADE
    );
