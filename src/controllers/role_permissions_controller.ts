import { Request, Response } from 'express';
import { RolePermissionService } from '../services/role_permissions_service';

export class RolePermissionController {
    static async getAllRolePermissions(req: Request, res: Response): Promise<void> {
        try {
            const rolePermissions = await RolePermissionService.getAllRolePermissions();
            res.json({
                success: true,
                data: rolePermissions,
                message: 'All role permissions retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve role permissions.'
            });
        }
    }

    static async getRolePermissionById(req: Request, res: Response): Promise<void> {
        try {
            const { role_permission_id } = req.params;
            const rolePermission = await RolePermissionService.getRolePermissionById(role_permission_id);
            if (rolePermission) {
                res.json({
                    success: true,
                    data: rolePermission,
                    message: 'Role permission retrieved successfully.'
                });
            } else {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Role permission not found.'
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve role permission.'
            });
        }
    }

    static async createRolePermission(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await RolePermissionService.createRolePermission(data);
            res.status(201).json({
                success: true,
                data: null,
                message: 'Role permission created successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to create role permission.'
            });
        }
    }

    static async updateRolePermission(req: Request, res: Response): Promise<void> {
        try {
            const { role_permission_id } = req.params;
            const data = req.body;
            await RolePermissionService.updateRolePermission(role_permission_id, data);
            res.json({
                success: true,
                data: null,
                message: 'Role permission updated successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to update role permission.'
            });
        }
    }

    static async deleteRolePermission(req: Request, res: Response): Promise<void> {
        try {
            const { role_permission_id } = req.params;
            await RolePermissionService.deleteRolePermission(role_permission_id);
            res.json({
                success: true,
                data: null,
                message: 'Role permission deleted successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to delete role permission.'
            });
        }
    }
}
