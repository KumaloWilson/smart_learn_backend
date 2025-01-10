// // routes/instructor.routes.ts
// import express from 'express';
// import { InstructorController } from '../controllers/quiz';
// import { authenticateInstructor } from '../middleware/auth';

// const router = express.Router();

// // Instructor management routes
// router.get('/dashboard/:instructor_id', authenticateInstructor, InstructorController.getDashboard);
// router.get('/courses/:instructor_id', authenticateInstructor, InstructorController.getCourses);
// router.get('/interventions/:course_id', authenticateInstructor, InstructorController.getInterventions);
// router.post('/feedback/:attempt_id', authenticateInstructor, InstructorController.provideFeedback);
// router.get('/reports/:course_id', authenticateInstructor, InstructorController.generateReports);

// export default router;
