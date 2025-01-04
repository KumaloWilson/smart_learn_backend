CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50),
    surname VARCHAR(50),
    nationality VARCHAR(50),
    national_id VARCHAR(20),
    place_of_birth VARCHAR(50),
    citizenship VARCHAR(50),
    permanent_address TEXT,
    email_address VARCHAR(100),
    phone_numbers VARCHAR(50),
    contact_address TEXT,
    permanent_home_address TEXT,
    date_of_birth DATE,
    marital_status VARCHAR(20),
    religion VARCHAR(50),
    title VARCHAR(10),
    sex VARCHAR(10),
    radio_frequency_id VARCHAR(20)
);



