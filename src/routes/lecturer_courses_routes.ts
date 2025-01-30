import { Router } from 'express';
import { LecturerCourseAssignmentController } from '../controllers/lecturer_courses_controller';

const router = Router();

router.get('/', LecturerCourseAssignmentController.getAllAssignments);
router.get('/:assignment_id', LecturerCourseAssignmentController.getAssignmentById);
router.get('/lecturer/:lecturer_id', LecturerCourseAssignmentController.getAssignmentsByLecturerId);
router.post('/', LecturerCourseAssignmentController.createAssignment);
router.put('/:assignment_id', LecturerCourseAssignmentController.updateAssignment);
router.delete('/:assignment_id', LecturerCourseAssignmentController.deleteAssignment);
router.get('/semester/:semester/year/:academic_year', LecturerCourseAssignmentController.getAssignmentsBySemesterAndYear);
router.post('/bulk', LecturerCourseAssignmentController.bulkCreateAssignments);
router.put('/bulk', LecturerCourseAssignmentController.bulkUpdateAssignments);

export default router;
