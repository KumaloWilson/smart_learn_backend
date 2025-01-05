import { Router } from 'express';
import { AdminController } from '../controllers/admin_controller';

const router = Router();


router.get('/', AdminController.getAllAdmins);
router.get('/:admin_id', AdminController.getAdminById);
router.post('/', AdminController.createAdmin);
router.put('/:admin_id', AdminController.updateAdmin);
router.delete('/:admin_id', AdminController.deleteAdmin);

export default router;
