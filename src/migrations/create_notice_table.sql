CREATE TABLE IF NOT EXISTS notice (
    notice_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    body TEXT,
    date DATE,
    link VARCHAR(255),
    certification_id INT
);