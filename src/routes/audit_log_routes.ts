import { Router } from 'express';
import { AuditLogController } from '../controllers/audit_log_controller';

const router = Router();

router.get('/', AuditLogController.getAllAuditLogs);
router.get('/:log_id', AuditLogController.getAuditLogById);
router.post('/', AuditLogController.createAuditLog);
router.put('/:log_id', AuditLogController.updateAuditLog);
router.delete('/:log_id', AuditLogController.deleteAuditLog);

export default router;
