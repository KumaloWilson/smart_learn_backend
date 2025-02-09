-- Registration Period Table
CREATE TABLE IF NOT EXISTS registration_period (
    period_id VARCHAR(50) PRIMARY KEY,
    current_session VARCHAR(255),
    start_date DATE,
    end_date DATE,
    period_name VARCHAR(255),
    period VARCHAR(255),
    active BOOLEAN
);