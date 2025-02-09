import { Router } from 'express';
import { StudentAcademicRecordController } from '../controllers/student_academic_records_controller';

const router = Router();

router.get('/', StudentAcademicRecordController.getAllRecords);
router.get('/:record_id', StudentAcademicRecordController.getRecordById);
router.post('/', StudentAcademicRecordController.createRecord);
router.put('/:record_id', StudentAcademicRecordController.updateRecord);
router.delete('/:record_id', StudentAcademicRecordController.deleteRecord);

export default router;
