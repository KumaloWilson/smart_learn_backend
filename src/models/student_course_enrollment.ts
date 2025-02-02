export interface CourseEnrollmentBasic {
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
    registration_number: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    enrollment_status: 'active' | 'suspended' | 'graduated' | 'withdrawn' | 'deferred';
}

export interface AttendanceRecord {
    attendance_id: string;
    class_date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
}

export interface ProgressRecord {
    progress_id: string;
    subtopic_id: string;
    mastery_level: number;
    attempts_count: number;
    last_attempt_date?: Date;
}

export interface StudentCourseEnrollmentDetails extends CourseEnrollmentBasic {
    attendance_records: AttendanceRecord[];
    progress_records: ProgressRecord[];
}