
CREATE TABLE IF NOT EXISTS module (
    module_id VARCHAR(50) PRIMARY KEY,
    module_name VARCHAR(255),
    module_code VARCHAR(255),
    module_unit_code VARCHAR(255),
    module_description TEXT,
    lecturer_id VARCHAR(50),
    period_id VARCHAR(50),
    credits INT DEFAULT 3,
    is_evaluable BOOLEAN,
    vle_status BOOLEAN
);