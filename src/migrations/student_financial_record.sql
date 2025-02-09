CREATE TABLE IF NOT EXISTS student_financial_records (
    finance_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester ENUM('fall', 'spring', 'summer') NOT NULL,
    fee_type ENUM('tuition', 'accommodation', 'library', 'laboratory', 'other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    payment_status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    payment_date DATE,
    payment_reference VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
