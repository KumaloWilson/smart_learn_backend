export interface StudentAcademicRecord {
    record_id: string;
    student_id: string;
    program_id: string;
    academic_year: string;
    semester: 'fall' | 'spring' | 'summer';
    gpa?: number;
    cgpa?: number;
    total_credits_earned?: number;
    academic_standing: 'good' | 'warning' | 'probation' | 'dismissed';
    comments?: string;
    created_at?: string;
    updated_at?: string;
}
