export interface Course {
    course_id: string;
    program_id?: string;
    course_name: string;
    course_code?: string;
    period_id?: string;
    credit_hours?: number;
    description?: string;
    prerequisites?: string;
    semester_offered?: 'fall' | 'spring' | 'summer' | 'all';
    course_level?: number;
    is_elective?: boolean;
    phase?: number;
    syllabus_path?: string;
    status?: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
}
