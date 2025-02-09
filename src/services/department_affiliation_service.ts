import db from '../config/sql_config';
import { LecturerDepartmentAffiliation } from '../models/department_affiliation';

export class LecturerDepartmentAffiliationService {
    static async getAllAffiliations(): Promise<LecturerDepartmentAffiliation[]> {
        const [rows] = await db.query('SELECT * FROM lecturer_department_affiliations');
        return rows as LecturerDepartmentAffiliation[];
    }

    static async getAffiliationById(affiliation_id: string): Promise<LecturerDepartmentAffiliation | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM lecturer_department_affiliations WHERE affiliation_id = ?',
            [affiliation_id]
        );
        return rows[0] || null;
    }

    static async createAffiliation(data: LecturerDepartmentAffiliation): Promise<void> {
        const sql = `INSERT INTO lecturer_department_affiliations SET ?`;
        await db.query(sql, data);
    }

    static async updateAffiliation(
        affiliation_id: string,
        data: Partial<LecturerDepartmentAffiliation>
    ): Promise<void> {
        const sql = `UPDATE lecturer_department_affiliations SET ? WHERE affiliation_id = ?`;
        await db.query(sql, [data, affiliation_id]);
    }

    static async deleteAffiliation(affiliation_id: string): Promise<void> {
        await db.query('DELETE FROM lecturer_department_affiliations WHERE affiliation_id = ?', [
            affiliation_id,
        ]);
    }
}
