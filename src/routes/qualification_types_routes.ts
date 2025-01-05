import { Router } from 'express';
import { QualificationTypeController } from '../controllers/qualification_types_controller';

const router = Router();

router.get('/', QualificationTypeController.getAllQualificationTypes);
router.get('/:qualification_id', QualificationTypeController.getQualificationTypeById);
router.post('/', QualificationTypeController.createQualificationType);
router.put('/:qualification_id', QualificationTypeController.updateQualificationType);
router.delete('/:qualification_id', QualificationTypeController.deleteQualificationType);

export default router;
