import db from '../config/sql_config';
import { StudentAttendance } from '../models/student_attendance';

export class StudentAttendanceService {
    static async getAllAttendances(): Promise<StudentAttendance[]> {
        const [rows] = await db.query('SELECT * FROM student_attendance');
        return rows as StudentAttendance[];
    }

    static async getAttendanceById(attendance_id: string): Promise<StudentAttendance | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM student_attendance WHERE attendance_id = ?',
            [attendance_id]
        );
        return rows[0] || null;
    }

    static async createAttendance(data: StudentAttendance): Promise<void> {
        const sql = `INSERT INTO student_attendance SET ?`;
        await db.query(sql, data);
    }

    static async updateAttendance(attendance_id: string, data: Partial<StudentAttendance>): Promise<void> {
        const sql = `UPDATE student_attendance SET ? WHERE attendance_id = ?`;
        await db.query(sql, [data, attendance_id]);
    }

    static async deleteAttendance(attendance_id: string): Promise<void> {
        await db.query('DELETE FROM student_attendance WHERE attendance_id = ?', [attendance_id]);
    }
}
