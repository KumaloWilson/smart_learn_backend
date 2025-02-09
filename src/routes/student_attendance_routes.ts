import { Router } from 'express';
import { StudentAttendanceController } from '../controllers/student_attendance_controller';

const router = Router();

router.get('/', StudentAttendanceController.getAllAttendances);
router.get('/:attendance_id', StudentAttendanceController.getAttendanceById);
router.post('/', StudentAttendanceController.createAttendance);
router.put('/:attendance_id', StudentAttendanceController.updateAttendance);
router.delete('/:attendance_id', StudentAttendanceController.deleteAttendance);

export default router;
