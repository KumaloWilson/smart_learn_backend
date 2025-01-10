import { Request, Response } from 'express';
import { QuizSessionService } from '../services/quiz_session_service';

export class QuizController {
    static async startQuiz(req: Request, res: Response) {
        try {
            const { student_id, quiz } = req.body;
            const attempt_id = await QuizSessionService.startQuizAttempt(student_id, quiz);
            res.json({ attempt_id });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async submitQuiz(req: Request, res: Response) {
        try {
            const { attempt_id, responses } = req.body;
            const score = await QuizSessionService.submitQuizAttempt(attempt_id, responses);
            res.json({ score });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
