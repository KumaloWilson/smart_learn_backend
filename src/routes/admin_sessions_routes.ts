import { Router } from 'express';
import { AdminSessionController } from '../controllers/admin_sessions_controller';

const router = Router();

router.get('/', AdminSessionController.getAllAdminSessions);
router.get('/:session_id', AdminSessionController.getAdminSessionById);
router.post('/', AdminSessionController.createAdminSession);
router.put('/:session_id', AdminSessionController.updateAdminSession);
router.delete('/:session_id', AdminSessionController.deleteAdminSession);

export default router;
