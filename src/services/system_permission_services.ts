import db from '../config/sql_config';
import { SystemPermission } from '../models/system_permission';

export class SystemPermissionService {
    static async getAllPermissions(): Promise<SystemPermission[]> {
        const [rows] = await db.query('SELECT * FROM system_permissions');
        return rows as SystemPermission[];
    }

    static async getPermissionById(permission_id: string): Promise<SystemPermission | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM system_permissions WHERE permission_id = ?',
            [permission_id]
        );
        return rows[0] || null;
    }

    static async createPermission(data: SystemPermission): Promise<void> {
        const sql = `INSERT INTO system_permissions SET ?`;
        await db.query(sql, data);
    }

    static async updatePermission(permission_id: string, data: Partial<SystemPermission>): Promise<void> {
        const sql = `UPDATE system_permissions SET ? WHERE permission_id = ?`;
        await db.query(sql, [data, permission_id]);
    }

    static async deletePermission(permission_id: string): Promise<void> {
        await db.query('DELETE FROM system_permissions WHERE permission_id = ?', [permission_id]);
    }
}
