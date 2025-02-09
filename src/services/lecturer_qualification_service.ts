import db from '../config/sql_config';
import { LecturerQualification } from '../models/lecturer_qualification';

export class LecturerQualificationService {
    static async getAllLecturerQualifications(): Promise<LecturerQualification[]> {
        const [rows] = await db.query('SELECT * FROM lecturer_qualifications');
        return rows as LecturerQualification[];
    }

    static async getLecturerQualificationById(lecturer_qualification_id: string): Promise<LecturerQualification | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM lecturer_qualifications WHERE lecturer_qualification_id = ?',
            [lecturer_qualification_id]
        );
        return rows[0] || null;
    }

    static async createLecturerQualification(data: LecturerQualification): Promise<void> {
        const sql = `INSERT INTO lecturer_qualifications SET ?`;
        await db.query(sql, data);
    }

    static async updateLecturerQualification(
        lecturer_qualification_id: string,
        data: Partial<LecturerQualification>
    ): Promise<void> {
        const sql = `UPDATE lecturer_qualifications SET ? WHERE lecturer_qualification_id = ?`;
        await db.query(sql, [data, lecturer_qualification_id]);
    }

    static async deleteLecturerQualification(lecturer_qualification_id: string): Promise<void> {
        await db.query('DELETE FROM lecturer_qualifications WHERE lecturer_qualification_id = ?', [
            lecturer_qualification_id,
        ]);
    }
}
