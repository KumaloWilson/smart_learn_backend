export interface StudentAttendance {
    attendance_id: string;
    student_id: string;
    course_id: string;
    class_date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
    created_at?: string;
}
