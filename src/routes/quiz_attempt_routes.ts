import express from 'express';
import { QuizController } from '../controllers/quiz_controller';
import { authenticateStudent } from '../middleware/auth';
import { validateQuizSubmission } from '../middleware/validation';

const router = express.Router();

// Quiz session routes
router.post('/start', authenticateStudent, QuizController.startQuiz);
router.post('/submit', [authenticateStudent, validateQuizSubmission], QuizController.submitQuiz);
router.get('/attempt/:attempt_id', authenticateStudent, QuizController.getQuizAttempt);
router.get('/history/:student_id', authenticateStudent, QuizController.getQuizHistory);

// Quiz management routes
router.get('/:quiz_id', authenticateStudent, QuizController.getQuizDetails);
router.get('/subtopic/:subtopic_id', authenticateStudent, QuizController.getQuizzesBySubtopic);
router.get('/practice/:topic_id', authenticateStudent, QuizController.getPracticeQuizzes);

export default router;