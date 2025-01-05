import db from '../config/sql_config';
import { AdminSession } from '../models/admin_sessions';

export class AdminSessionService {
    static async getAllAdminSessions(): Promise<AdminSession[]> {
        const [rows] = await db.query('SELECT * FROM admin_sessions');
        return rows as AdminSession[];
    }

    static async getAdminSessionById(session_id: string): Promise<AdminSession | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM admin_sessions WHERE session_id = ?',
            [session_id]
        );
        return rows[0] || null;
    }

    static async createAdminSession(data: AdminSession): Promise<void> {
        const sql = `INSERT INTO admin_sessions SET ?`;
        await db.query(sql, data);
    }

    static async updateAdminSession(session_id: string, data: Partial<AdminSession>): Promise<void> {
        const sql = `UPDATE admin_sessions SET ? WHERE session_id = ?`;
        await db.query(sql, [data, session_id]);
    }

    static async deleteAdminSession(session_id: string): Promise<void> {
        await db.query('DELETE FROM admin_sessions WHERE session_id = ?', [session_id]);
    }
}
