import { Request, Response } from 'express';
import { QuizResponseService } from '../services/quiz_response_service';
import { QuizSessionService } from '../services/quiz_session_service';

export class QuizResponseController {
    static async submitResponse(req: Request, res: Response) {
        try {
            const response = await QuizResponseService.submitQuestionResponse({
                attempt_id: req.body.attempt_id,
                question_id: req.body.question_id,
                student_answer: req.body.student_answer,
                time_taken: req.body.time_taken
            });

            res.json({
                success: true,
                message: 'Successfully submitted',
                data: response
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async submitFullQuiz(req: Request, res: Response) {
        try {
            const { attempt_id, responses } = req.body;
            const score = await QuizSessionService.submitQuizAttempt(attempt_id, responses);
            const statistics = await QuizResponseService.calculateAttemptStatistics(attempt_id);

            res.json({
                success: true,
                message: 'Successfully submitted',
                data: {
                    score,
                    statistics
                }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getAttemptResponses(req: Request, res: Response) {
        try {
            const responses = await QuizResponseService.getAttemptResponses(req.params.attempt_id);
            res.json({
                success: true,
                data: responses
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}