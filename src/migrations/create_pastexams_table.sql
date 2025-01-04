

CREATE TABLE IF NOT EXISTS past_exam_papers (
    past_exam_paper_id VARCHAR(50) PRIMARY KEY,
    year YEAR,
    description VARCHAR(255),
    document_size INT,
    period_id INT,
    document_path VARCHAR(255),
    module_id VARCHAR(50),
    FOREIGN KEY (module_id) REFERENCES module(module_id)
);