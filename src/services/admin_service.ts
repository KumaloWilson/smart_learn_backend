import db from '../config/sql_config';
import { Admin } from '../models/admin';

export class AdminService {
    static async getAllAdmins(): Promise<Admin[]> {
        const [rows] = await db.query('SELECT * FROM admins');
        return rows as Admin[];
    }

    static async getAdminByUID(uid: string): Promise<Admin | null> {
        const [rows]: any = await db.query('SELECT * FROM admins WHERE uid = ?', [uid]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async getAdminByUsername(username: string): Promise<Admin | null> {
        const [rows]: any = await db.query('SELECT * FROM admins WHERE email = ?', [username]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async createAdmin(admin: Admin): Promise<Admin | null> {
        const sql = `INSERT INTO admins SET ?`;
        await db.query(sql, admin);

        return admin;
    }

    static async updateAdmin(id: number, admin: Partial<Admin>): Promise<void> {
        const sql = `UPDATE admins SET ? WHERE id = ?`;
        await db.query(sql, [admin, id]);
    }

    static async deleteAdmin(id: number): Promise<void> {
        await db.query('DELETE FROM admins WHERE id = ?', [id]);
    }
}
