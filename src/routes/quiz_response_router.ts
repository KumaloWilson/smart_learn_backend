import { Router } from 'express';
import { QuizResponseController } from '../controllers/quiz_response_controller';
// import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post(
    '/responses',
    // authMiddleware,
    QuizResponseController.submitResponse
);

router.post(
    '/submit',
    // authMiddleware,
    QuizResponseController.submitFullQuiz
);

router.get(
    '/attempts/:attempt_id/responses',
    // authMiddleware,
    QuizResponseController.getAttemptResponses
);

export default router;