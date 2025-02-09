import db from '../config/sql_config';
import { School } from '../models/school';

export class SchoolService {
    static async getAllSchools(): Promise<School[]> {
        const [rows] = await db.query('SELECT * FROM schools');
        return rows as School[];
    }

    static async getSchoolById(school_id: string): Promise<School | null> {
        const [rows]: any = await db.query('SELECT * FROM schools WHERE school_id = ?', [school_id]);
        return rows[0] || null;
    }

    static async createSchool(school: School): Promise<void> {
        const sql = `INSERT INTO schools SET ?`;
        await db.query(sql, school);
    }

    static async updateSchool(school_id: string, school: Partial<School>): Promise<void> {
        const sql = `UPDATE schools SET ? WHERE school_id = ?`;
        await db.query(sql, [school, school_id]);
    }

    static async deleteSchool(school_id: string): Promise<void> {
        await db.query('DELETE FROM schools WHERE school_id = ?', [school_id]);
    }
}
