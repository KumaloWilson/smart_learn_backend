import { Router } from 'express';
import { StudentCourseController } from '../controllers/course_enrollment_controller';

const router = Router();

// Course information routes
router.get('/:student_id/courses', StudentCourseController.getStudentCourses);
router.get('/:student_id/courses/current', StudentCourseController.getCurrentEnrolledSemesterCourses);
router.get('/:course_id/students/current', StudentCourseController.getEnrolledStudentsByCourse);
router.get('/:student_id/courses/history', StudentCourseController.getStudentCourseHistory);
router.get('/:student_id/gpa/:academic_year/:semester', StudentCourseController.getStudentSemesterGPA);

// Enrollment management routes
router.post('/enroll', StudentCourseController.enrollStudentInCourse);
router.post('/bulk-enroll', StudentCourseController.bulkEnrollStudentInCourses);
router.put('/:enrollment_id', StudentCourseController.updateEnrollment);

export default router;