import { Request, Response } from 'express';
import { AdminService } from '../services/admin_product_service';

export class AdminController {
    private adminService = new AdminService();

    // Get admin profile by UID
    async getProfile(req: Request, res: Response): Promise<void> {
        const { uid } = req.params;
        try {
            const admin = await this.adminService.getAdminProfile(uid);
            res.status(200).json({ success: true, data: admin });
        } catch (error) {
            res.status(400).json({ success: false, message: error });
        }
    }

    // Create a new admin profile
    async createProfile(req: Request, res: Response): Promise<void> {
        const { uid, name, email, phone_number, address } = req.body;
        try {
            await this.adminService.createAdminProfile({ uid, name, email, phone_number, address });
            res.status(201).json({ success: true, message: 'Admin profile created' });
        } catch (error) {
            res.status(400).json({ success: false, message: error });
        }
    }

    // Update admin profile
    async updateProfile(req: Request, res: Response): Promise<void> {
        const { uid } = req.params;
        const updates = req.body;
        try {
            await this.adminService.updateAdminProfile(uid, updates);
            res.status(200).json({ success: true, message: 'Admin profile updated' });
        } catch (error) {
            res.status(400).json({ success: false, message: error });
        }
    }

    // Delete admin profile
    async deleteProfile(req: Request, res: Response): Promise<void> {
        const { uid } = req.params;
        try {
            await this.adminService.deleteAdminProfile(uid);
            res.status(200).json({ success: true, message: 'Admin profile deleted' });
        } catch (error) {
            res.status(400).json({ success: false, message: error });
        }
    }
}
