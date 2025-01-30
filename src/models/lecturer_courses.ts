export interface LecturerCourseAssignment {
    assignment_id: string;
    lecturer_id: string;
    course_id: string;
    academic_year: string;
    semester: '1' | '2';
    role: 'primary' | 'assistant' | 'guest';
    created_at?: Date;
}


export interface LecturerCourseAssignmentDetails {
    assignment_id: string;
    lecturer_id: string;
    course_id: string;
    academic_year: string;
    semester: '1' | '2';
    role: 'primary' | 'assistant' | 'guest';
    course_name: string;
    course_code: string;
    description: string;
    created_at?: Date;
}