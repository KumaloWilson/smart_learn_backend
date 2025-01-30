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

router.get('/status/:status', CourseController.getCoursesByStatus);
router.get('/elective/:is_elective', CourseController.getCoursesByElectiveStatus);
router.get('/phase/:phase', CourseController.getCoursesByPhase);
router.get('/semester-offered/:semester_offered', CourseController.getCoursesBySemesterOffered);
router.get('/level/:level', CourseController.getCoursesByLevel);
router.get('/prerequisites/:prerequisites', CourseController.getCoursesByPrerequisites);
router.get('/credit-hours/:credit_hours', CourseController.getCoursesByCreditHours);

export default router;
