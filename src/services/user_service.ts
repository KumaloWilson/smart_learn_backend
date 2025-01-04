import bcrypt from 'bcrypt';
import db from '../config/sql_config';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth_response'
import { AdminService } from './admin_service';
import { LecturerService } from './lecturer_service'
import { StudentService } from './student_service';

export class UserService {
    static async getAllUsers(): Promise<User[]> {
        const [rows] = await db.query('SELECT uid, username, role, created_at, updated_at FROM users');
        return rows as User[];
    }

    static async getUserById(uid: string): Promise<User | null> {
        const [rows]: any = await db.query('SELECT uid, username, role, created_at, updated_at FROM users WHERE uid = ?', [uid]);
        return rows[0] || null;
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        const [rows]: any = await db.query('SELECT uid, username, role, created_at, updated_at FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    }

    static async createUserAuthAccount(user: User): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const sql = `INSERT INTO users (uid, username, role, password) VALUES (?, ?, ?, ?)`;
        await db.query(sql, [user.uid, user.username, user.role, hashedPassword]);

        return user
    }

    static async updateUser(uid: string, user: Partial<User>): Promise<void> {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        const sql = `UPDATE users SET ? WHERE uid = ?`;
        await db.query(sql, [user, uid]);
    }

    static async deleteUser(uid: string): Promise<void> {
        await db.query('DELETE FROM users WHERE uid = ?', [uid]);
    }


    // Service
    static async authenticateUser(username: string, password: string): Promise<AuthResponse | null> {
        try {
            const [rows]: any = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            const user = rows[0] as User;

            if (!user) {
                throw new Error('USER_NOT_FOUND');
            }

            console.log("password", password);
            console.log('user', user.password);

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {

                console.log('user', user.password);

                throw new Error('INVALID_PASSWORD');
            }

            const { role } = user;
            let profile = null;

            try {
                switch (role) {
                    case 'admin':
                        profile = await AdminService.getAdminByUsername(username);
                        break;
                    case 'student':
                        profile = await StudentService.getStudentByStudentID(username);
                        break;
                    case 'lecturer':
                        profile = await LecturerService.getLecturerByUsername(username);
                        break;
                    default:
                        throw new Error('INVALID_ROLE');
                }

                if (!profile) {
                    throw new Error('PROFILE_NOT_FOUND');
                }

            } catch (profileError) {
                console.error('Profile fetch error:', profileError);
                throw profileError;
            }

            return { user, role, profile };
        } catch (error) {
            console.error('Authentication service error:', error);
            throw error;
        }
    }
}


