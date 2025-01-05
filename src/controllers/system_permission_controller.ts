import { Request, Response } from 'express';
import { SystemPermissionService as SystemPermissionService } from '../services/system_permission_services';

export class SystemPermissionController {
    static async getAllPermissions(req: Request, res: Response): Promise<void> {
        try {
            const permissions = await SystemPermissionService.getAllPermissions();
            res.json(permissions);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getPermissionById(req: Request, res: Response): Promise<void> {
        try {
            const { permission_id } = req.params;
            const permission = await SystemPermissionService.getPermissionById(permission_id);
            if (permission) {
                res.json(permission);
            } else {
                res.status(404).json({ message: 'Permission not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createPermission(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await SystemPermissionService.createPermission(data);
            res.status(201).json({ message: 'Permission created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updatePermission(req: Request, res: Response): Promise<void> {
        try {
            const { permission_id } = req.params;
            const data = req.body;
            await SystemPermissionService.updatePermission(permission_id, data);
            res.json({ message: 'Permission updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deletePermission(req: Request, res: Response): Promise<void> {
        try {
            const { permission_id } = req.params;
            await SystemPermissionService.deletePermission(permission_id);
            res.json({ message: 'Permission deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
