import { Request, Response } from 'express';
import { SystemPermissionService } from '../services/system_permission_services';

export class SystemPermissionController {
    static async getAllPermissions(req: Request, res: Response): Promise<void> {
        try {
            const permissions = await SystemPermissionService.getAllPermissions();
            res.json({
                success: true,
                data: permissions,
                message: 'All permissions retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve permissions.',
                error: err
            });
        }
    }

    static async getPermissionById(req: Request, res: Response): Promise<void> {
        try {
            const { permission_id } = req.params;
            const permission = await SystemPermissionService.getPermissionById(permission_id);
            if (permission) {
                res.json({
                    success: true,
                    data: permission,
                    message: 'Permission retrieved successfully.'
                });
            } else {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Permission not found.'
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve permission.',
                error: err
            });
        }
    }

    static async createPermission(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await SystemPermissionService.createPermission(data);
            res.status(201).json({
                success: true,
                data: null,
                message: 'Permission created successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to create permission.',
                error: err
            });
        }
    }

    static async updatePermission(req: Request, res: Response): Promise<void> {
        try {
            const { permission_id } = req.params;
            const data = req.body;
            await SystemPermissionService.updatePermission(permission_id, data);
            res.json({
                success: true,
                data: null,
                message: 'Permission updated successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to update permission.',
                error: err
            });
        }
    }

    static async deletePermission(req: Request, res: Response): Promise<void> {
        try {
            const { permission_id } = req.params;
            await SystemPermissionService.deletePermission(permission_id);
            res.json({
                success: true,
                data: null,
                message: 'Permission deleted successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to delete permission.',
                error: err
            });
        }
    }
}
