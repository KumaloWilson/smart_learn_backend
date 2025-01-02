import { AdminModel } from '../models/admin'; // Adjusted the import path

export class AdminService {
    private adminModel = new AdminModel();

    // Get admin profile by UID
    async getAdminProfile(uid: string): Promise<any> {
        try {
            const admin = await this.adminModel.getProfile(uid);
            if (!admin) {
                throw new Error('Admin not found');
            }
            return admin;
        } catch (error) {
            throw new Error('Service error fetching admin profile: ' + error);
        }
    }

    // Create a new admin profile
    async createAdminProfile(adminData: { uid: string, name: string, email: string, phone_number?: string, address?: string }): Promise<void> {
        try {
            // Check if the admin already exists by email
            const exists = await this.adminModel.adminExists(adminData.email);
            if (exists) {
                throw new Error('Admin with this email already exists');
            }

            // Create the admin profile
            await this.adminModel.createProfile(adminData);
        } catch (error) {
            throw new Error('Service error creating admin profile: ' + error);
        }
    }

    // Update an admin profile
    async updateAdminProfile(uid: string, updates: Partial<any>): Promise<void> {
        try {
            const admin = await this.adminModel.getProfile(uid);
            if (!admin) {
                throw new Error('Admin not found');
            }

            // Update the admin profile
            await this.adminModel.updateProfile(uid, updates);
        } catch (error) {
            throw new Error('Service error updating admin profile: ' + error);
        }
    }

    // Delete an admin profile
    async deleteAdminProfile(uid: string): Promise<void> {
        try {
            const admin = await this.adminModel.getProfile(uid);
            if (!admin) {
                throw new Error('Admin not found');
            }

            // Delete the admin profile
            await this.adminModel.deleteProfile(uid);
        } catch (error) {
            throw new Error('Service error deleting admin profile: ' + error);
        }
    }
}
