import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import db from '../config/sql_config';
import { AdminService } from './admin_service';
import { LecturerService } from './lecturer_service';
import { StudentService } from './student_service';
import { User } from "../models/user";
import { AuthResponse } from "../models/auth_response";

export class UserService {
    private static readonly SALT_ROUNDS = 12;
    private static readonly MAX_LOGIN_ATTEMPTS = 5;
    private static readonly LOCK_TIME = 15 * 60 * 1000; // 15 minutes
    private static readonly JWT_SECRET = process.env.JWT_SECRET!;
    private static readonly JWT_EXPIRES_IN = '1h';
    private static readonly PASSWORD_RESET_EXPIRES = 10 * 60 * 1000; // 10 minutes

    static async createUserAuthAccount(user: Partial<User>): Promise<Omit<User, 'password'>> {
        const hashedPassword = await bcrypt.hash(user.password!, this.SALT_ROUNDS);

        const sql = `
      INSERT INTO users (
        uid, username, role, password, 
        passwordChangedAt, active, loginAttempts, 
        lockUntil, created_at, updated_at
      ) 
      VALUES (?, ?, ?, ?, NOW(), true, 0, NULL, NOW(), NOW())
    `;

        await db.query(sql, [
            user.uid,
            user.username,
            user.role,
            hashedPassword
        ]);

        const { password, ...userWithoutPassword } = user as User;
        return userWithoutPassword;
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        const [rows]: any = await db.query('SELECT uid, username, role, created_at, updated_at FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    }


    static async authenticateUser(username: string, password: string): Promise<AuthResponse> {
        const [rows]: any = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        const user = rows[0] as User;

        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

        if (!user.active) {
            throw new Error('ACCOUNT_DISABLED');
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            throw new Error('ACCOUNT_LOCKED');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            // Increment login attempts
            const loginAttempts = user.loginAttempts + 1;
            const updates: Partial<User> = { loginAttempts };

            // Lock account if max attempts reached
            if (loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
                updates.lockUntil = new Date(Date.now() + this.LOCK_TIME);
            }

            await db.query(
                'UPDATE users SET ? WHERE uid = ?',
                [updates, user.uid]
            );

            throw new Error('INVALID_PASSWORD');
        }

        // Reset login attempts and update last login
        await db.query(
            'UPDATE users SET loginAttempts = 0, lastLogin = NOW(), lockUntil = NULL WHERE uid = ?',
            [user.uid]
        );

        // Get user profile based on role
        let profile;
        try {
            switch (user.role) {
                case 'admin':
                    profile = await AdminService.getAdminByUsername(username);
                    break;
                case 'student':
                    profile = await StudentService.getStudentProfileByStudentID(username);
                    break;
                case 'lecturer':
                    profile = await LecturerService.getLecturerByUsername(username);
                    break;
                default:
                    throw new Error('INVALID_ROLE');
            }
        } catch (error) {
            throw new Error('PROFILE_NOT_FOUND');
        }

        const token = this.generateToken(user);

        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            role: user.role,
            profile,
            token
        };
    }

    private static generateToken(user: User): string {
        return jwt.sign(
            {
                uid: user.uid,
                username: user.username,
                role: user.role
            },
            this.JWT_SECRET,
            {
                expiresIn: this.JWT_EXPIRES_IN
            }
        );
    }

    static async verifyToken(token: string): Promise<any> {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new Error('INVALID_TOKEN');
        }
    }

    static async changePassword(
        uid: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const [rows]: any = await db.query(
            'SELECT * FROM users WHERE uid = ?',
            [uid]
        );
        const user = rows[0] as User;

        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new Error('INVALID_PASSWORD');
        }

        const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
        await db.query(
            'UPDATE users SET password = ?, passwordChangedAt = NOW() WHERE uid = ?',
            [hashedPassword, uid]
        );
    }

    static async deactivateAccount(uid: string): Promise<void> {
        await db.query(
            'UPDATE users SET active = false WHERE uid = ?',
            [uid]
        );
    }

    static async reactivateAccount(uid: string): Promise<void> {
        await db.query(
            'UPDATE users SET active = true, loginAttempts = 0, lockUntil = NULL WHERE uid = ?',
            [uid]
        );
    }
}
