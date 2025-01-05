import { Router } from 'express';
import { StudentCourseEnrollmentController } from '../controllers/course_enrollment_controller';

const router = Router();

router.get('/', StudentCourseEnrollmentController.getAllEnrollments);
router.get('/:enrollment_id', StudentCourseEnrollmentController.getEnrollmentById);
router.post('/', StudentCourseEnrollmentController.createEnrollment);
router.put('/:enrollment_id', StudentCourseEnrollmentController.updateEnrollment);
router.delete('/:enrollment_id', StudentCourseEnrollmentController.deleteEnrollment);

export default router;
