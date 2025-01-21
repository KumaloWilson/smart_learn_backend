import { Router } from 'express';
import { CourseController } from '../controllers/courses_controller';

const router = Router();

router.get('/', CourseController.getAllCourses);
router.get('/:course_id', CourseController.getCourseById);
router.get('/program/:program_id', CourseController.getCoursesByProgramId);
router.get('/program/:program_id/level/:level', CourseController.getCoursesByProgramIdAndLevel);
router.post('/', CourseController.createCourse);
router.put('/:course_id', CourseController.updateCourse);
router.delete('/:course_id', CourseController.deleteCourse);

export default router;
