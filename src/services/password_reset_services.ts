import db from '../config/sql_config';
import { PasswordResetToken } from '../models/password_reset_token';

export class PasswordResetTokenService {
    static async getAllTokens(): Promise<PasswordResetToken[]> {
        const [rows] = await db.query('SELECT * FROM password_reset_tokens');
        return rows as PasswordResetToken[];
    }

    static async getTokenById(token_id: string): Promise<PasswordResetToken | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM password_reset_tokens WHERE token_id = ?',
            [token_id]
        );
        return rows[0] || null;
    }

    static async getResetTokenByAdmin(admin_id: string): Promise<PasswordResetToken | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM password_reset_tokens WHERE admin_id = ? AND used = FALSE',
            [admin_id]
        );
        return rows[0] || null;
    }

    static async createToken(data: PasswordResetToken): Promise<void> {
        const sql = `INSERT INTO password_reset_tokens SET ?`;
        await db.query(sql, data);
    }

    static async updateToken(token_id: string, data: Partial<PasswordResetToken>): Promise<void> {
        const sql = `UPDATE password_reset_tokens SET ? WHERE token_id = ?`;
        await db.query(sql, [data, token_id]);
    }

    static async deleteToken(token_id: string): Promise<void> {
        await db.query('DELETE FROM password_reset_tokens WHERE token_id = ?', [token_id]);
    }
}
