import { Router } from 'express';
import { AdminController } from '../controllers/admin_controller';

const router = Router();

router.get('/', AdminController.getAllAdmins);
router.get('/:id', AdminController.getAdminById);
router.post('/', AdminController.createAdmin);
router.put('/:id', AdminController.updateAdmin);
router.delete('/:id', AdminController.deleteAdmin);

export default router;
