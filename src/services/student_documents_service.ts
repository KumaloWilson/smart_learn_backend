import db from '../config/sql_config';
import { StudentDocument } from '../models/student_documents';

export class StudentDocumentService {
    static async getAllDocuments(): Promise<StudentDocument[]> {
        const [rows] = await db.query('SELECT * FROM student_documents');
        return rows as StudentDocument[];
    }

    static async getDocumentById(document_id: string): Promise<StudentDocument | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM student_documents WHERE document_id = ?',
            [document_id]
        );
        return rows[0] || null;
    }

    static async createDocument(data: StudentDocument): Promise<void> {
        const sql = `INSERT INTO student_documents SET ?`;
        await db.query(sql, data);
    }

    static async updateDocument(document_id: string, data: Partial<StudentDocument>): Promise<void> {
        const sql = `UPDATE student_documents SET ? WHERE document_id = ?`;
        await db.query(sql, [data, document_id]);
    }

    static async deleteDocument(document_id: string): Promise<void> {
        await db.query('DELETE FROM student_documents WHERE document_id = ?', [document_id]);
    }
}
