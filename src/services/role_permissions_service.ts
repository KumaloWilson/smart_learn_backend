import db from '../config/sql_config';
import { RolePermission } from '../models/role_permissions';

export class RolePermissionService {
    static async getAllRolePermissions(): Promise<RolePermission[]> {
        const [rows] = await db.query('SELECT * FROM role_permissions');
        return rows as RolePermission[];
    }

    static async getRolePermissionById(role_permission_id: string): Promise<RolePermission | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM role_permissions WHERE role_permission_id = ?',
            [role_permission_id]
        );
        return rows[0] || null;
    }

    static async createRolePermission(data: RolePermission): Promise<void> {
        const sql = `INSERT INTO role_permissions SET ?`;
        await db.query(sql, data);
    }

    static async updateRolePermission(role_permission_id: string, data: Partial<RolePermission>): Promise<void> {
        const sql = `UPDATE role_permissions SET ? WHERE role_permission_id = ?`;
        await db.query(sql, [data, role_permission_id]);
    }

    static async deleteRolePermission(role_permission_id: string): Promise<void> {
        await db.query('DELETE FROM role_permissions WHERE role_permission_id = ?', [role_permission_id]);
    }
}
