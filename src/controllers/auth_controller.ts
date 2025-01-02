import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user_service';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const userService = new UserService();

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        const user = await userService.login(username, password);

        const newToken = jwt.sign(
            { uid: user.profile.uid, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Login successful',
            token: newToken,
            profile: user.profile,
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed. Invalid credentials or token.' });
    }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
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

        const existingUser = await userService.findUserByUsername(username);
        if (existingUser) {
            res.status(400).json({ error: 'Username is already taken.' });
            return;
        }

        const uid = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await userService.registerUser(uid, username, role, hashedPassword);

        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                uid: user.uid,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
};
