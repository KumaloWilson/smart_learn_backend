import { Request, Response } from 'express';
import { UserService } from '../services/user_service';

export class UserController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const {uid, username, password, role } = req.body;

            // Validation
            if (!username || !password || !role) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }

            // Password strength validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                res.status(400).json({
                    error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                });
                return;
            }

            const existingUser = await UserService.getUserByUsername(username);
            if (existingUser) {
                res.status(400).json({ error: 'Username already exists' });
                return;
            }

            const user = await UserService.createUserAuthAccount({
                uid: uid,
                username,
                password,
                role
            });

            res.status(201).json({
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: 'Username and password are required' });
                return;
            }

            const authResponse = await UserService.authenticateUser(username, password);

            res.status(200).json({
                message: 'Login successful',
                ...authResponse
            });
        } catch (error: any) {
            console.error('Login error:', error);

            const errorMessages: { [key: string]: { status: number, message: string } } = {
                'USER_NOT_FOUND': { status: 401, message: 'Invalid username or password' },
                'INVALID_PASSWORD': { status: 401, message: 'Invalid username or password' },
                'ACCOUNT_LOCKED': { status: 403, message: 'Account is temporarily locked. Please try again later' },
                'ACCOUNT_DISABLED': { status: 403, message: 'Account is disabled. Please contact support' },
                'PROFILE_NOT_FOUND': { status: 404, message: 'User profile not found' },
                'INVALID_ROLE': { status: 400, message: 'Invalid user role' }
            };

            const errorResponse = errorMessages[error.message] ||
                { status: 500, message: 'Internal server error' };

            res.status(errorResponse.status).json({ error: errorResponse.message });
        }
    }

    static async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { uid } = req.params;
            const { currentPassword, newPassword } = req.body;

            await UserService.changePassword(uid, currentPassword, newPassword);

            res.json({ message: 'Password changed successfully' });
        } catch (error: any) {
            console.error('Change password error:', error);

            const errorMessages: { [key: string]: { status: number, message: string } } = {
                'USER_NOT_FOUND': { status: 404, message: 'User not found' },
                'INVALID_PASSWORD': { status: 401, message: 'Current password is incorrect' }
            };

            const errorResponse = errorMessages[error.message] ||
                { status: 500, message: 'Internal server error' };

            res.status(errorResponse.status).json({ error: errorResponse.message });
        }
    }
}