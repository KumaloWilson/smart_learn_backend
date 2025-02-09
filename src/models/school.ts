export interface School {
    school_id: string;
    school_name: string;
    school_code: string;
    dean_id?: string;
    establishment_date?: Date;
    description?: string;
    building_location?: string;
    contact_email?: string;
    contact_phone?: string;
    status?: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
}
