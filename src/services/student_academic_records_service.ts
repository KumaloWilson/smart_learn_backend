import db from '../config/sql_config';
import { StudentAcademicRecord } from '../models/student_academic_record';
import {Admin} from "../models/admin";

export class StudentAcademicRecordService {
    static async getAllRecords(): Promise<StudentAcademicRecord[]> {
        const [rows] = await db.query('SELECT * FROM student_academic_records');
        return rows as StudentAcademicRecord[];
    }

    static async getRecordById(record_id: string): Promise<StudentAcademicRecord | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM student_academic_records WHERE record_id = ?',
            [record_id]
        );
        return rows[0] || null;
    }

    static async createRecord(data: StudentAcademicRecord): Promise<StudentAcademicRecord | null> {
        const sql = `INSERT INTO student_academic_records SET ?`;
        await db.query(sql, data);

        return  data;
    }

    static async updateRecord(record_id: string, data: Partial<StudentAcademicRecord>): Promise<void> {
        const sql = `UPDATE student_academic_records SET ? WHERE record_id = ?`;
        await db.query(sql, [data, record_id]);
    }

    static async deleteRecord(record_id: string): Promise<void> {
        await db.query('DELETE FROM student_academic_records WHERE record_id = ?', [record_id]);
    }
}
