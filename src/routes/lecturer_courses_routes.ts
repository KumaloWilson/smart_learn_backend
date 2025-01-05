import { Router } from 'express';
import { LecturerCourseAssignmentController } from '../controllers/lecturer_courses_controller';

const router = Router();

router.get('/', LecturerCourseAssignmentController.getAllAssignments);
router.get('/:assignment_id', LecturerCourseAssignmentController.getAssignmentById);
router.post('/', LecturerCourseAssignmentController.createAssignment);
router.put('/:assignment_id', LecturerCourseAssignmentController.updateAssignment);
router.delete('/:assignment_id', LecturerCourseAssignmentController.deleteAssignment);

export default router;
