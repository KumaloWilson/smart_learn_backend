import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user_service';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export class UserController {
    static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { uid } = req.params;
            const user = await UserService.getUserById(uid);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, role } = req.body;

            if (!username || !password || !role) {
                res.status(400).json({ error: 'Username, password, and role are required' });
                return;
            }

            if (password.length < 8) {
                res.status(400).json({ error: 'Password must be at least 8 characters long.' });
                return;
            }

            const existingUser = await UserService.getUserByUsername(username);
            if (existingUser) {
                res.status(400).json({ error: 'Username is already taken.' });
                return;
            }

            const uid = uuidv4();
            const hashedPassword = await bcrypt.hash(password, 12);



            const user = await UserService.createUserAuthAccount({ uid, username, role, password: hashedPassword });

            res.status(201).json({
                message: 'User registered successfully.',
                user: {
                    uid: user.uid,
                    username: user.username,
                    role: user.role,
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'An error occurred while registering the user.' });
        }
    }


    static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { uid } = req.params;
            const user = req.body;
            await UserService.updateUser(uid, user);
            res.json({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { uid } = req.params;
            await UserService.deleteUser(uid);
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: 'Both username and password are required' });
                return;
            }

            try {
                const authResponse = await UserService.authenticateUser(username, password);

                if (!authResponse) {
                    res.status(401).json({ error: 'Authentication failed. Please check your credentials.' });
                    return;
                }

                const { user, role, profile } = authResponse;

                if (!profile) {
                    res.status(404).json({ error: `Profile not found for ${role}. Please contact administrator.` });
                    return;
                }

                const newToken = jwt.sign(
                    {
                        uid: user.username,
                        role: role
                    },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.status(200).json({
                    message: 'Login successful',
                    token: newToken,
                    profile: profile,
                });

            } catch (authError: any) {
                if (authError.message === 'USER_NOT_FOUND') {
                    res.status(401).json({ error: 'Username not found. Please check your username.' });
                } else if (authError.message === 'INVALID_PASSWORD') {
                    res.status(401).json({ error: 'Incorrect password. Please try again.' });
                } else if (authError.message === 'INVALID_ROLE') {
                    res.status(400).json({ error: 'Invalid user role. Please contact administrator.' });
                } else {
                    res.status(500).json({ error: 'An unexpected error occurred during authentication.' });
                }
                return;
            }

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'An unexpected error occurred during login.' });
        }
    }

    static async verifyPassword(req: Request, res: Response): Promise<void> {
        try {
            const { password, hash } = req.body;

            if (!password || !hash) {
                res.status(400).json({
                    success: false,
                    message: 'Password and hash are required'
                });
                return;
            }

            const isMatch = await bcrypt.compare(password, hash);
            console.log('Password verification result:', isMatch);

            res.status(200).json({
                success: true,
                isMatch,
                message: isMatch ? 'Password matches hash' : 'Password does not match hash'
            });

        } catch (error) {
            console.error('Password verification error:', error);
            res.status(500).json({
                success: false,
                message: 'Error verifying password',
                error: error
            });
        }
    }
}