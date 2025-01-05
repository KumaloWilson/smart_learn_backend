import db from '../config/sql_config';
import { StudentFinancialRecord } from '../models/financial_record';

export class StudentFinancialRecordService {
    static async getAllFinancialRecords(): Promise<StudentFinancialRecord[]> {
        const [rows] = await db.query('SELECT * FROM student_financial_records');
        return rows as StudentFinancialRecord[];
    }

    static async getFinancialRecordById(finance_id: string): Promise<StudentFinancialRecord | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM student_financial_records WHERE finance_id = ?',
            [finance_id]
        );
        return rows[0] || null;
    }

    static async createFinancialRecord(data: StudentFinancialRecord): Promise<void> {
        const sql = `INSERT INTO student_financial_records SET ?`;
        await db.query(sql, data);
    }

    static async updateFinancialRecord(finance_id: string, data: Partial<StudentFinancialRecord>): Promise<void> {
        const sql = `UPDATE student_financial_records SET ? WHERE finance_id = ?`;
        await db.query(sql, [data, finance_id]);
    }

    static async deleteFinancialRecord(finance_id: string): Promise<void> {
        await db.query('DELETE FROM student_financial_records WHERE finance_id = ?', [finance_id]);
    }
}
