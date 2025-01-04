import { Request, Response } from 'express';
import { AdminService } from '../services/admin_service';
import { UserService } from '../services/user_service';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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
            const uid = uuidv4();

            // Add the uid to admin data
            const adminWithUID = {
                ...adminData,
                uid
            };

            // Check if user with email already exists
            const existingUser = await UserService.getUserByUsername(adminData.email);

            if (existingUser) {
                res.status(400).json({ error: 'User with the same email already exists' });
                return;
            }


            // Create the admin profile
            const createdAdmin = await AdminService.createAdmin(adminWithUID);

            // Create corresponding user account for authentication
            const DEFAULT_PASSWORD = "Welcome123!";
            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

            if (!createdAdmin) {
                res.status(500).json({ error: 'Failed to create admin profile' });
                return;
            }

            const userData = {
                uid,
                username: createdAdmin.email,
                password: hashedPassword,
                role: 'admin'
            };


            // Create the user account
            await UserService.createUserAuthAccount(userData);

            res.status(201).json({
                message: 'Admin profile and user account created successfully',
                admin: createdAdmin,
                userAccount: {
                    uid,
                    username: userData.username,
                    role: userData.role
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
            res.json({ message: 'Admin updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await AdminService.deleteAdmin(parseInt(id));
            res.json({ message: 'Admin deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
