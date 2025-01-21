import { Student } from './student';
import { StudentAcademicRecord } from './student_academic_record';

export interface StudentAcademicProfile extends Student {
    academic_record?: StudentAcademicRecord;
}