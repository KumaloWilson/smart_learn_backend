import { Request, Response } from 'express';
import { AdminService } from '../services/admin_service';
import { UserService } from '../services/user_service';
import bcrypt from 'bcrypt';
import {User} from "../models/user";

export class AdminController {
    static async getAllAdmins(req: Request, res: Response): Promise<void> {
        try {
            const admins = await AdminService.getAllAdmins();
            res.json(admins);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAdminById(req: Request, res: Response): Promise<void> {
        try {
            const { uid } = req.params;
            const admin = await AdminService.getAdminByUID(uid);
            if (admin) {
                res.json(admin);
            } else {
                res.status(404).json({ message: 'Admin not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createAdmin(req: Request, res: Response): Promise<void> {
        try {
            const adminData = req.body;

            // Check if user with email already exists
            const existingUser = await UserService.getUserByUsername(adminData.email);

            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: 'User with the same email already exists'
                });
                return;
            }


            // Create the admin profile
            const createdAdmin = await AdminService.createAdmin(adminData);



            if (!createdAdmin) {
                res.status(500).json({ error: 'Failed to create admin profile' });
                return;
            }

            const userData: Partial<User> = {
                uid: createdAdmin.admin_id,
                username: createdAdmin.email,
                password: 'Password123?',
                role: 'admin'
            };


            // Create the user account
            await UserService.createUserAuthAccount(userData);

            res.status(201).json({
                success: true,
                message: 'Admin profile and user account created successfully',
                admin: createdAdmin,
                userAccount: {
                    uid: createdAdmin.admin_id,
                    username: userData.username,
                    role: userData.role,
                },
            });

        } catch (err) {
            console.error('Error creating admin and user account:', err);
            res.status(500).json({
                error: 'Failed to create admin and associated user account',
                details: err
            });
        }
    }

    static async updateAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const admin = req.body;
            await AdminService.updateAdmin(parseInt(id), admin);
            res.json({ success: true, message: 'Admin updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await AdminService.deleteAdmin(parseInt(id));
            res.json({ success: true, message: 'Admin deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
