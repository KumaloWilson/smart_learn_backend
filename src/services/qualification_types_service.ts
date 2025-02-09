import db from '../config/sql_config';
import { QualificationType } from '../models/qualification_types';

export class QualificationTypeService {
    static async getAllQualificationTypes(): Promise<QualificationType[]> {
        const [rows] = await db.query('SELECT * FROM qualification_types');
        return rows as QualificationType[];
    }

    static async getQualificationTypeById(qualification_id: string): Promise<QualificationType | null> {
        const [rows]: any = await db.query('SELECT * FROM qualification_types WHERE qualification_id = ?', [qualification_id]);
        return rows[0] || null;
    }

    static async createQualificationType(qualification: QualificationType): Promise<void> {
        const sql = `INSERT INTO qualification_types SET ?`;
        await db.query(sql, qualification);
    }

    static async updateQualificationType(
        qualification_id: string,
        qualification: Partial<QualificationType>
    ): Promise<void> {
        const sql = `UPDATE qualification_types SET ? WHERE qualification_id = ?`;
        await db.query(sql, [qualification, qualification_id]);
    }

    static async deleteQualificationType(qualification_id: string): Promise<void> {
        await db.query('DELETE FROM qualification_types WHERE qualification_id = ?', [qualification_id]);
    }
}
