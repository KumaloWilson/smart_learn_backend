import { Router } from 'express';
import { StudentController } from '../controllers/student_controller';

const router = Router();

router.get('/', StudentController.getAllStudents);
router.get('/:student_id', StudentController.getStudentById);
router.get('/:student_id/profile', StudentController.getStudentProfileByStudentID);
router.post('/', StudentController.createStudent);
router.put('/:student_id', StudentController.updateStudent);
router.delete('/:student_id', StudentController.deleteStudent);

export default router;
