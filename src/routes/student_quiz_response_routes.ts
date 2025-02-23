import { Router } from 'express';
import {StudentQuizAttemptsController} from "../controllers/student_quiz_attempt_controller";

const router = Router();

// Get all quiz attempts for the student
router.get('/attempts', StudentQuizAttemptsController.getAllAttempts);

// Get quiz attempts for a specific course
router.get('/course/:courseId/attempts', StudentQuizAttemptsController.getCourseAttempts);

// Get quiz attempts statistics grouped by course
router.get('/attempts/stats', StudentQuizAttemptsController.getAttemptsByCourseStats);

// Get detailed information about a specific attempt
router.get('/attempts/:attemptId', StudentQuizAttemptsController.getAttemptDetails);

export default router;