import { Request, Response } from 'express';
import { AdminRoleService } from '../services/admin_roles_service';

export class AdminRoleController {
    static async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await AdminRoleService.getAllRoles();
            res.json(roles);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getRoleById(req: Request, res: Response): Promise<void> {
        try {
            const { role_id } = req.params;
            const role = await AdminRoleService.getRoleById(role_id);
            if (role) {
                res.json(role);
            } else {
                res.status(404).json({ success: false, message: 'Role not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createRole(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await AdminRoleService.createRole(data);
            res.status(201).json({ success: true, message: 'Role created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateRole(req: Request, res: Response): Promise<void> {
        try {
            const { role_id } = req.params;
            const data = req.body;
            await AdminRoleService.updateRole(role_id, data);
            res.json({ success: true, message: 'Role updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteRole(req: Request, res: Response): Promise<void> {
        try {
            const { role_id } = req.params;
            await AdminRoleService.deleteRole(role_id);
            res.json({ success: true, message: 'Role deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
