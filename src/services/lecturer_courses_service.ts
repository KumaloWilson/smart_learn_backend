import db from '../config/sql_config';
import { LecturerCourseAssignment } from '../models/lecturer_courses';

export class LecturerCourseAssignmentService {
    static async getAllAssignments(): Promise<LecturerCourseAssignment[]> {
        const [rows] = await db.query('SELECT * FROM lecturer_course_assignments');
        return rows as LecturerCourseAssignment[];
    }

    static async getAssignmentById(assignment_id: string): Promise<LecturerCourseAssignment | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM lecturer_course_assignments WHERE assignment_id = ?',
            [assignment_id]
        );
        return rows[0] || null;
    }

    static async createAssignment(data: LecturerCourseAssignment): Promise<void> {
        const sql = `INSERT INTO lecturer_course_assignments SET ?`;
        await db.query(sql, data);
    }

    static async updateAssignment(
        assignment_id: string,
        data: Partial<LecturerCourseAssignment>
    ): Promise<void> {
        const sql = `UPDATE lecturer_course_assignments SET ? WHERE assignment_id = ?`;
        await db.query(sql, [data, assignment_id]);
    }

    static async deleteAssignment(assignment_id: string): Promise<void> {
        await db.query('DELETE FROM lecturer_course_assignments WHERE assignment_id = ?', [
            assignment_id,
        ]);
    }
}
