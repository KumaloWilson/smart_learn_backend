import express from 'express';
import { QuizSessionController } from '../controllers/quiz_session_controller';
//import { authenticateStudent } from '../middleware/auth';
//import { validateQuizSubmission } from '../middlewares/quiz_validation';

const router = express.Router();

// Quiz session routes
router.post('/start', QuizSessionController.startQuiz);
router.post('/submit', QuizSessionController.submitQuiz);
router.get('/current/:attempt_id', QuizSessionController.getQuizSession)
router.get('/available', QuizSessionController.getAllQuizzes)

// router.get('/attempt/:attempt_id', authenticateStudent, QuizController.getQuizAttempt);
// router.get('/history/:student_id', authenticateStudent, QuizController.getQuizHistory);

// // Quiz management routes
// router.get('/:quiz_id', QuizController.getQuizDetails);
// router.get('/subtopic/:subtopic_id', QuizController.getQuizzesBySubtopic);
// router.get('/practice/:topic_id', QuizController.getPracticeQuizzes);


export default router;