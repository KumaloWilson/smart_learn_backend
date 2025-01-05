export interface Student {
    student_id: string;
    registration_number: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    date_of_birth: string;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    personal_email?: string;
    phone?: string;
    address?: string;
    nationality?: string;
    national_id?: string;
    passport_number?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relationship?: string;
    admission_date: string;
    current_program_id: string;
    enrollment_status: 'active' | 'suspended' | 'graduated' | 'withdrawn' | 'deferred';
    photo_url?: string;
    created_at?: string;
    updated_at?: string;
}
