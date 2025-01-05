export interface Department {
    department_id: string;
    school_id: string;
    department_name: string;
    department_code?: string;
    head_of_department_id?: string;
    establishment_date?: Date;
    description?: string;
    office_location?: string;
    contact_email?: string;
    contact_phone?: string;
    status?: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
}
