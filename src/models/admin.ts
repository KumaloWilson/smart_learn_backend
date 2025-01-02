import db from '../config/sql_config'; // Database connection

export class AdminModel {
    // Get admin profile by UID
    async getProfile(uid: string): Promise<any> {
        try {
            const [rows]: any = await db.query('SELECT * FROM admins WHERE uid = ?', [uid]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error('Error fetching admin profile: ' + error);
        }
    }

    // Create a new admin profile
    async createProfile(admin: { uid: string, name: string, email: string, phone_number?: string, address?: string, is_active?: boolean, role?: 'admin' | 'superadmin', profile_picture_url?: string }): Promise<void> {
        try {
            await db.query('INSERT INTO admins (uid, name, email, phone_number, address, is_active, role, profile_picture_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
                admin.uid,
                admin.name,
                admin.email,
                admin.phone_number || null,
                admin.address || null,
                admin.is_active ?? true,  // default to true if not provided
                admin.role || 'admin',    // default to 'admin' if not provided
                admin.profile_picture_url || null
            ]);
        } catch (error) {
            throw new Error('Error creating admin profile: ' + error);
        }
    }


    // Update an existing admin profile
    async updateProfile(uid: string, updates: Partial<any>): Promise<void> {
        try {
            const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            await db.query(`UPDATE admins SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE uid = ?`, [...values, uid]);
        } catch (error) {
            throw new Error('Error updating admin profile: ' + error);
        }
    }

    // Delete an admin profile
    async deleteProfile(uid: string): Promise<void> {
        try {
            await db.query('DELETE FROM admins WHERE uid = ?', [uid]);
        } catch (error) {
            throw new Error('Error deleting admin profile: ' + error);
        }
    }

    // Check if the admin exists by email (useful for login or creating unique admins)
    async adminExists(email: string): Promise<boolean> {
        try {
            const [rows]: any = await db.query('SELECT 1 FROM admins WHERE email = ?', [email]);
            return rows.length > 0;
        } catch (error) {
            throw new Error('Error checking if admin exists: ' + error);
        }
    }

    // Check if the admin exists by UID
    async adminExistsByUID(uid: string): Promise<boolean> {
        try {
            const [rows]: any = await db.query('SELECT 1 FROM admins WHERE uid = ?', [uid]);
            return rows.length > 0;
        } catch (error) {
            throw new Error('Error checking if admin exists by UID: ' + error);
        }
    }

    // Get admin by email
    async getAdminByEmail(email: string): Promise<any> {
        try {
            const [rows]: any = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error('Error fetching admin by email: ' + error);
        }
    }
}
