import db from '../config/sql_config';
import { AdminRole } from '../models/admin_roles';

export class AdminRoleService {
    static async getAllRoles(): Promise<AdminRole[]> {
        const [rows] = await db.query('SELECT * FROM admin_roles');
        return rows as AdminRole[];
    }

    static async getRoleById(role_id: string): Promise<AdminRole | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM admin_roles WHERE role_id = ?',
            [role_id]
        );
        return rows[0] || null;
    }

    static async createRole(data: AdminRole): Promise<void> {
        const sql = `INSERT INTO admin_roles SET ?`;
        await db.query(sql, data);
    }

    static async updateRole(role_id: string, data: Partial<AdminRole>): Promise<void> {
        const sql = `UPDATE admin_roles SET ? WHERE role_id = ?`;
        await db.query(sql, [data, role_id]);
    }

    static async deleteRole(role_id: string): Promise<void> {
        await db.query('DELETE FROM admin_roles WHERE role_id = ?', [role_id]);
    }
}
