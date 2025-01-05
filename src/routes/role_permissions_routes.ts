import { Router } from 'express';
import { RolePermissionController } from '../controllers/role_permissions_controller';

const router = Router();

router.get('/', RolePermissionController.getAllRolePermissions);
router.get('/:role_permission_id', RolePermissionController.getRolePermissionById);
router.post('/', RolePermissionController.createRolePermission);
router.put('/:role_permission_id', RolePermissionController.updateRolePermission);
router.delete('/:role_permission_id', RolePermissionController.deleteRolePermission);

export default router;
