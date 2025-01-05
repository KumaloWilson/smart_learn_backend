import db from '../config/sql_config';
import { StudentCourseEnrollment } from '../models/course_enrollment';

export class StudentCourseEnrollmentService {
    static async getAllEnrollments(): Promise<StudentCourseEnrollment[]> {
        const [rows] = await db.query('SELECT * FROM student_course_enrollments');
        return rows as StudentCourseEnrollment[];
    }

    static async getEnrollmentById(enrollment_id: string): Promise<StudentCourseEnrollment | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM student_course_enrollments WHERE enrollment_id = ?',
            [enrollment_id]
        );
        return rows[0] || null;
    }

    static async createEnrollment(data: StudentCourseEnrollment): Promise<void> {
        const sql = `INSERT INTO student_course_enrollments SET ?`;
        await db.query(sql, data);
    }

    static async updateEnrollment(enrollment_id: string, data: Partial<StudentCourseEnrollment>): Promise<void> {
        const sql = `UPDATE student_course_enrollments SET ? WHERE enrollment_id = ?`;
        await db.query(sql, [data, enrollment_id]);
    }

    static async deleteEnrollment(enrollment_id: string): Promise<void> {
        await db.query('DELETE FROM student_course_enrollments WHERE enrollment_id = ?', [enrollment_id]);
    }
}
