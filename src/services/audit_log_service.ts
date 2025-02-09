import db from '../config/sql_config';
import { AuditLog } from '../models/audit_log';

export class AuditLogService {
    static async getAllAuditLogs(): Promise<AuditLog[]> {
        const [rows] = await db.query('SELECT * FROM system_audit_logs');
        return rows as AuditLog[];
    }

    static async getAuditLogById(log_id: string): Promise<AuditLog | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM system_audit_logs WHERE log_id = ?',
            [log_id]
        );
        return rows[0] || null;
    }

    static async createAuditLog(data: AuditLog): Promise<void> {
        const sql = `INSERT INTO system_audit_logs SET ?`;
        await db.query(sql, data);
    }

    static async updateAuditLog(log_id: string, data: Partial<AuditLog>): Promise<void> {
        const sql = `UPDATE system_audit_logs SET ? WHERE log_id = ?`;
        await db.query(sql, [data, log_id]);
    }

    static async deleteAuditLog(log_id: string): Promise<void> {
        await db.query('DELETE FROM system_audit_logs WHERE log_id = ?', [log_id]);
    }
}
