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
        const [rows]: any = await db.query('SELECT * FROM lecturers WHERE email_address = ?', [username]);
        return rows[0] || null;
    }

    static async createLecturer(lecturer: Lecturer): Promise<Lecturer | null> {
        const sql = `
      INSERT INTO lecturers 
      (lecturer_id, first_name, last_name, email_address, phone_number, office_address, date_of_birth, nationality, sex, department_id, faculty_id, title, joined_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await db.query(sql, [
            lecturer.lecturer_id,
            lecturer.first_name,
            lecturer.last_name,
            lecturer.email_address,
            lecturer.phone_number,
            lecturer.office_address,
            lecturer.date_of_birth,
            lecturer.nationality,
            lecturer.sex,
            lecturer.department_id,
            lecturer.faculty_id,
            lecturer.title,
            lecturer.joined_date,
        ]);

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
