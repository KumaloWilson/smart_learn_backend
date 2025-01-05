export interface LecturerCourseAssignment {
    assignment_id: string;
    lecturer_id: string;
    course_id: string;
    academic_year: string;
    semester: 'fall' | 'spring' | 'summer';
    role: 'primary' | 'assistant' | 'guest';
    created_at?: Date;
}
