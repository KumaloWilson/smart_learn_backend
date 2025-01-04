export interface Lecturer {
    id?: number;
    lecturer_id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number?: string;
    office_address?: string;
    date_of_birth?: Date;
    nationality?: string;
    sex?: 'MALE' | 'FEMALE' | 'OTHER';
    department_id?: string;
    faculty_id?: number;
    title?: string;
    joined_date?: Date;
}
