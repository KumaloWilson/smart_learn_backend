// routes/question_generation_routes.ts
import express from 'express';
import { QuestionGenerationController } from '../controllers/question_generation_controller';
//import { authenticateUser, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.post(
    '/generate',
    // authenticateUser,
    // authorizeRole(['lecturer', 'admin']),
    QuestionGenerationController.generateQuestions
);

export default router;
