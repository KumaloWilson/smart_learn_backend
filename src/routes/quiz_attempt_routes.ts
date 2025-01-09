// routes/quiz_attempt_routes.ts
import express from 'express';
import { QuizAttemptController } from '../controllers/quiz_attempt_controller';
// import { authenticateUser } from '../middleware/auth';
// import { validateQuizAttempt } from '../middleware/validation';

const router = express.Router();

// Quiz attempt management routes
router.post(
    '/start',
    // authenticateUser,
    // validateQuizAttempt,
    QuizAttemptController.startAttempt
);

router.post(
    '/submit-answer',
    // authenticateUser,
    QuizAttemptController.submitAnswer
);

router.post(
    '/complete/:attempt_id',
    // authenticateUser,
    QuizAttemptController.completeAttempt
);

router.get(
    '/summary/:attempt_id',
    // authenticateUser,
    QuizAttemptController.getAttemptSummary
);

router.post(
    '/flag-answer/:answer_id',
    // authenticateUser,
    QuizAttemptController.flagAnswerForReview
);

export default router;
