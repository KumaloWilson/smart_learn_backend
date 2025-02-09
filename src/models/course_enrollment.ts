export interface StudentCourseEnrollment {
    enrollment_id: string;
    student_id: string;
    course_id: string;
    academic_year: string;
    semester: '1' | '2';
    enrollment_date: string;
    grade?: string;
    grade_points?: number;
    attendance_percentage?: number;
    status: 'enrolled' | 'withdrawn' | 'completed' | 'failed';
    is_retake: boolean;
    created_at?: string;
    updated_at?: string;
}
