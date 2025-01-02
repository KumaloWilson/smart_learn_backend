import db from '../config/sql_config';
import bcrypt from 'bcrypt';

export class UserModel {
    async login(username: string, password: string): Promise<{ role: string; uid: string } | null> {
        const [rows]: any = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return null;

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return { role: user.role, uid: user.uid };
    }

    async register(uid: string, username: string, role: string, password: string): Promise<any> {
        await db.query('INSERT INTO users (uid, username, role, password) VALUES (?, ?, ?, ?)', [
            uid,
            username,
            role,
            password,
        ]);

        return { uid, username, role };
    }

    async findUserByUsername(username: string): Promise<any> {
        const [rows]: any = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length ? rows[0] : null;
    }
}
