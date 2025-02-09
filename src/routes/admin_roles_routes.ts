import { Router } from 'express';
import { AdminRoleController } from '../controllers/admin_roles_controller';

const router = Router();

router.get('/all', AdminRoleController.getAllRoles);
router.get('/:role_id', AdminRoleController.getRoleById);
router.post('/', AdminRoleController.createRole);
router.put('/:role_id', AdminRoleController.updateRole);
router.delete('/:role_id', AdminRoleController.deleteRole);

export default router;
