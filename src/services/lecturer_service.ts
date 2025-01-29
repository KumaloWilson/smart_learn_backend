import db from '../config/sql_config';
import { Lecturer } from '../models/lecturer';

export class LecturerService {
    static async getAllLecturers(): Promise<Lecturer[]> {
        const [rows] = await db.query('SELECT * FROM lecturers');
        return rows as Lecturer[];
    }

    static async getLecturerByUID(lecturer_id: string): Promise<Lecturer | null> {
        const [rows]: any = await db.query('SELECT * FROM lecturers WHERE lecturer_id = ?', [lecturer_id]);
        return rows[0] || null;
    }

    static async getLecturerByUsername(username: string): Promise<Lecturer | null> {
        const [rows]: any = await db.query('SELECT * FROM lecturers WHERE email = ?', [username]);
        return rows[0] || null;
    }

    static async createLecturer(lecturer: Lecturer): Promise<Lecturer | null> {
        const sql = `INSERT INTO lecturers SET ?`;
        await db.query(sql, lecturer);

        return lecturer;
    }

    static async updateLecturer(lecturer_id: string, lecturer: Partial<Lecturer>): Promise<void> {
        const sql = `UPDATE lecturers SET ? WHERE lecturer_id = ?`;
        await db.query(sql, [lecturer, lecturer_id]);
    }

    static async deleteLecturer(lecturer_id: string): Promise<void> {
        await db.query('DELETE FROM lecturers WHERE lecturer_id = ?', [lecturer_id]);
    }
}


