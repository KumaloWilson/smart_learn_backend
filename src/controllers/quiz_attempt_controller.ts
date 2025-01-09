import { Request, Response } from 'express';
import { QuizAttemptService } from '../services/quiz_attempt_service';

export class QuizAttemptController {
    static async startAttempt(req: Request, res: Response) {
        try {
            const { quiz_id, student_id } = req.body;
            const attempt_id = await QuizAttemptService.startAttempt(quiz_id, student_id);
            res.status(200).json({ attempt_id });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async submitAnswer(req: Request, res: Response) {
        try {
            const { attempt_id, question_id, selected_answer, time_taken } = req.body;
            const result = await QuizAttemptService.submitAnswer({
                attempt_id,
                question_id,
                selected_answer,
                time_taken
            });
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async completeAttempt(req: Request, res: Response) {
        try {
            const { attempt_id, feedback } = req.body;
            await QuizAttemptService.completeAttempt(attempt_id, feedback);
            res.status(200).json({ message: 'Quiz attempt completed successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAttemptSummary(req: Request, res: Response) {
        try {
            const { attempt_id } = req.params;
            const summary = await QuizAttemptService.getAttemptSummary(attempt_id);
            res.status(200).json(summary);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async flagAnswerForReview(req: Request, res: Response) {
        try {
            const { answer_id } = req.params;
            const { feedback } = req.body;
            await QuizAttemptService.flagAnswerForReview(answer_id, feedback);
            res.status(200).json({ message: 'Answer flagged for review' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
