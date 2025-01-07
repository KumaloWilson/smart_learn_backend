export interface Lecturer {
    lecturer_id: string;
    staff_number: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    title: 'Dr.' | 'Prof.' | 'Mr.' | 'Mrs.' | 'Ms.' | 'Mx.';
    primary_department_id?: string;
    date_of_birth?: Date;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    phone?: string;
    office_location?: string;
    employment_status: 'full-time' | 'part-time' | 'visiting' | 'emeritus';
    position_title?: string;
    date_joined: Date;
    contract_end_date?: Date;
    research_interests?: string;
    bio?: string;
    profile_picture_url?: string;
    status: 'active' | 'on_leave' | 'sabbatical' | 'retired' | 'resigned';
    created_at?: Date;
    updated_at?: Date;
}
