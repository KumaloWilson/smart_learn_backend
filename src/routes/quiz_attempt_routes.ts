import express from 'express';
import { QuizSessionController } from '../controllers/quiz_session_controller';

const router = express.Router();

// Quiz session routes


router.post('/create', QuizSessionController.createQuizSession);
router.post('/start', QuizSessionController.startQuiz);
router.post('/submit', QuizSessionController.submitQuiz);
router.get('/current/:attempt_id', QuizSessionController.getQuizSession)
router.get('/available', QuizSessionController.getAllQuizzes)


export default router;