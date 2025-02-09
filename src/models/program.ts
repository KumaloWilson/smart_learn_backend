export interface Program {
    program_id: string;
    school_id: string;
    program_name: string;
    program_code?: string;
    degree_level?: 'certificate' | 'diploma' | 'bachelor' | 'master' | 'doctorate';
    duration_years?: number;
    credit_hours?: number;
    description?: string;
    coordinator_id?: string;
    accreditation_status?: string;
    entry_requirements?: string;
    status?: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
}
