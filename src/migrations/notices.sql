CREATE TABLE IF NOT EXISTS notice (
    notice_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    body TEXT,
    date DATE,
    link VARCHAR(255)
);