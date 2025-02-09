import { Router } from 'express';
import { SystemPermissionController } from '../controllers/system_permission_controller';

const router = Router();

router.get('/', SystemPermissionController.getAllPermissions);
router.get('/:permission_id', SystemPermissionController.getPermissionById);
router.post('/', SystemPermissionController.createPermission);
router.put('/:permission_id', SystemPermissionController.updatePermission);
router.delete('/:permission_id', SystemPermissionController.deletePermission);

export default router;
