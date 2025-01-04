import db from '../config/sql_config';
import { Student } from '../models/student';

export class StudentService {
    static async getAllStudents(): Promise<Student[]> {
        const [rows] = await db.query('SELECT * FROM students');
        return rows as Student[];
    }

    static async getStudentByStudentID(student_id: string): Promise<Student | null> {
        const [rows]: any = await db.query('SELECT * FROM students WHERE student_id = ?', [student_id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async createStudent(student: Student): Promise<Student | null> {
        const sql = `INSERT INTO students SET ?`;
        await db.query(sql, student);

        return student;
    }

    static async updateStudent(student_id: string, student: Partial<Student>): Promise<void> {
        const sql = `UPDATE students SET ? WHERE student_id = ?`;
        await db.query(sql, [student, student_id]);
    }

    static async deleteStudent(student_id: string): Promise<void> {
        await db.query('DELETE FROM students WHERE student_id = ?', [student_id]);
    }
}
