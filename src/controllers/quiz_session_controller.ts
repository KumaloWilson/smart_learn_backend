import { Request, Response } from 'express';
import { QuizSessionService } from '../services/quiz_session_service';

export class QuizSessionController {

    static async createQuizSession(req: Request, res: Response) {
        try {
            const quiz = req.body;
            const createdQuiz = await QuizSessionService.createQuiz(quiz); // Make sure you import/use the correct service
            res.json({
                success: true,
                message: 'Quiz created successfully.',
                data: createdQuiz // now returns the created quiz object
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }



    static async startQuiz(req: Request, res: Response) {
        try {
            const { student_id, quiz } = req.body;
            const attempt = await QuizSessionService.startQuizAttempt(student_id, quiz);
            res.json({
                success: true,
                data: attempt,
                message: 'Quiz attempt started successfully.'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    static async submitQuiz(req: Request, res: Response) {
        try {
            const { attempt_id, responses } = req.body;

            // Validate request body
            if (!attempt_id || !responses || !Array.isArray(responses)) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: 'Invalid request body. Required: attempt_id and responses array'
                });
            }

            // Validate each response
            for (const response of responses) {
                if (!response.question_id || !response.student_answer) {
                    return res.status(400).json({
                        success: false,
                        data: null,
                        message: 'Each response must have question_id and student_answer'
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
                },
                message: 'Quiz submitted successfully.'
            });
        } catch (error: any) {
            console.error('Quiz submission error:', error);
            res.status(400).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    static async getQuizSession(req: Request, res: Response) {
        const { attempt_id } = req.params;

        try {
            const response = await QuizSessionService.getQuizSessionDetails(attempt_id);

            return res.status(200).json({
                success: true,
                data: response,
                message: 'Quiz session details fetched successfully.'
            });
        } catch (error) {
            console.error('Error in getQuizSession:', error);
            return res.status(500).json({
                success: false,
                data: null,
                message: error instanceof Error ? error.message : 'Failed to fetch quiz session'
            });
        }
    }

    static async getAllQuizzes(req: Request, res: Response): Promise<void> {
        try {
            const quizzes = await QuizSessionService.getAllQuizzes();
            res.json({
                success: true,
                data: quizzes,
                message: 'All quizzes retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve quizzes.'
            });
        }
    }

    static async getQuizzesByCourseId(req: Request, res: Response): Promise<void> {
        const { course_id } = req.params;
        try {
            const quizzes = await QuizSessionService.getQuizzesByCourseId(course_id);
            res.json({
                success: true,
                data: quizzes,
                message: 'All quizzes retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve quizzes.'
            });
        }
    }

    static async getQuizzesByInstructorId(req: Request, res: Response): Promise<void> {
        const { instructor_id } = req.params;
        try {
            const quizzes = await QuizSessionService.getQuizzesByInstructorId(instructor_id);
            res.json({
                success: true,
                data: quizzes,
                message: 'All quizzes retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve quizzes.'
            });
        }
    }
}
