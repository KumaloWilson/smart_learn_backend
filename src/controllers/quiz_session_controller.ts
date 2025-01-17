import { Request, Response } from 'express';
import { QuizSessionService } from '../services/quiz_session_service';

export class QuizSessionController {
    static async startQuiz(req: Request, res: Response) {
        try {
            const { student_id, quiz } = req.body;
            const attempt = await QuizSessionService.startQuizAttempt(student_id, quiz);
            res.json({ attempt });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async submitQuiz(req: Request, res: Response) {
        try {
            const { attempt_id, responses } = req.body;

            // Validate request body
            if (!attempt_id || !responses || !Array.isArray(responses)) {
                return res.status(400).json({
                    error: 'Invalid request body. Required: attempt_id and responses array'
                });
            }

            // Validate each response
            for (const response of responses) {
                if (!response.question_id || !response.student_answer) {
                    return res.status(400).json({
                        error: 'Each response must have question_id and student_answer'
                    });
                }

                // Ensure time_taken is a valid number
                if (response.time_taken) {
                    response.time_taken = Number(response.time_taken);
                    if (isNaN(response.time_taken)) {
                        response.time_taken = 0; // Default to 0 if invalid
                    }
                }
            }

            const { score, detailedResponses } = await QuizSessionService.submitQuizAttempt(
                attempt_id,
                responses
            );

            return res.status(200).json({
                success: true,
                data: {
                    score,
                    detailedResponses
                }
            });
        } catch (error: any) {
            console.error('Quiz submission error:', error);
            res.status(400).json({ error: error.message });
        }
    }


    static async getQuizSession(req: Request, res: Response) {
        const { attempt_id } = req.params;

        try {
            const response = await QuizSessionService.getQuizSessionDetails(attempt_id);

            return res.status(200).json({
                success: true,
                data: response
            });
        } catch (error) {
            console.error('Error in getQuizSession:', error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch quiz session'
            });
        }
    }

    static async getAllQuizzes(req: Request, res: Response): Promise<void> {
        try {
            const quizzes = await QuizSessionService.getAllQuizzes();
            res.json(quizzes);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
