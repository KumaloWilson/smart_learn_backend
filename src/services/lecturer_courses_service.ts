import db from '../config/sql_config';
import { LecturerCourseAssignment, LecturerCourseAssignmentDetails } from '../models/lecturer_courses';

export class LecturerCourseAssignmentService {
    static async getAllAssignments(): Promise<LecturerCourseAssignmentDetails[]> {
        const sql = `
            SELECT 
                lca.assignment_id,
                lca.lecturer_id,
                lca.course_id,
                lca.academic_year,
                lca.semester,
                lca.role,
                c.course_name,
                c.course_code,
                c.description,
                lca.created_at
            FROM lecturer_course_assignments lca
            JOIN courses c ON lca.course_id = c.course_id;
        `;
        const [rows] = await db.query(sql);
        return rows as LecturerCourseAssignmentDetails[];
    }

    static async getAssignmentsByLecturerId(lecturer_id: string): Promise<LecturerCourseAssignmentDetails[]> {
        const sql = `
            SELECT 
                lca.assignment_id,
                lca.lecturer_id,
                lca.course_id,
                lca.academic_year,
                lca.semester,
                lca.role,
                c.course_name,
                c.course_code,
                c.description,
                lca.created_at
            FROM lecturer_course_assignments lca
            JOIN courses c ON lca.course_id = c.course_id
            WHERE lca.lecturer_id = ?;
        `;
        const [rows] = await db.query(sql, [lecturer_id]);
        return rows as LecturerCourseAssignmentDetails[];
    }

    static async getAssignmentById(assignment_id: string): Promise<LecturerCourseAssignmentDetails | null> {
        const sql = `
            SELECT 
                lca.assignment_id,
                lca.lecturer_id,
                lca.course_id,
                lca.academic_year,
                lca.semester,
                lca.role,
                c.course_name,
                c.course_code,
                c.description,
                lca.created_at
            FROM lecturer_course_assignments lca
            JOIN courses c ON lca.course_id = c.course_id
            WHERE lca.assignment_id = ?;
        `;
        const [rows]: any = await db.query(sql, [assignment_id]);
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
        await db.query('DELETE FROM lecturer_course_assignments WHERE assignment_id = ?', [assignment_id]);
    }

    static async getAssignmentsBySemesterAndYear(semester: string, academic_year: string): Promise<LecturerCourseAssignmentDetails[]> {
        const sql = `
            SELECT 
                lca.assignment_id,
                lca.lecturer_id,
                lca.course_id,
                lca.academic_year,
                lca.semester,
                lca.role,
                c.course_name,
                c.course_code,
                c.description,
                lca.created_at
            FROM lecturer_course_assignments lca
            JOIN courses c ON lca.course_id = c.course_id
            WHERE lca.semester = ? AND lca.academic_year = ?;
        `;
        const [rows] = await db.query(sql, [semester, academic_year]);
        return rows as LecturerCourseAssignmentDetails[];
    }

    static async bulkCreateAssignments(assignments: LecturerCourseAssignment[]): Promise<void> {
        const sql = `INSERT INTO lecturer_course_assignments (assignment_id, lecturer_id, course_id, academic_year, semester, role) VALUES ?`;
        const values = assignments.map(assignment => [
            assignment.assignment_id,
            assignment.lecturer_id,
            assignment.course_id,
            assignment.academic_year,
            assignment.semester,
            assignment.role
        ]);
        await db.query(sql, [values]);
    }

    static async bulkUpdateAssignments(assignments: Partial<LecturerCourseAssignment>[]): Promise<void> {
        const sql = `UPDATE lecturer_course_assignments SET ? WHERE assignment_id = ?`;
        for (const assignment of assignments) {
            await db.query(sql, [assignment, assignment.assignment_id]);
        }
    }
}

