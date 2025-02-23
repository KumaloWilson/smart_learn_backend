import { Request, Response } from 'express';
import {StudentQuizAttemptsService} from "../services/student_quiz_response_service";

export class StudentQuizAttemptsController {
    static async getAllAttempts(req: Request, res: Response) {
        try {
            const {studentId} = req.params;
            const attempts = await StudentQuizAttemptsService.getStudentQuizAttempts(studentId);
            res.json({ success: true, data: attempts });
        } catch (error) {
            console.error('Error fetching quiz attempts:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch quiz attempts'
            });
        }
    }

    static async getCourseAttempts(req: Request, res: Response) {
        try {
            const {studentId} = req.params;
            const { courseId } = req.params;
            const attempts = await StudentQuizAttemptsService.getStudentCourseQuizAttempts(
                studentId,
                courseId
            );
            res.json({ success: true, data: attempts });
        } catch (error) {
            console.error('Error fetching course quiz attempts:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch course quiz attempts'
            });
        }
    }

    static async getAttemptsByCourseStats(req: Request, res: Response) {
        try {
            const {studentId} = req.params;
            const stats = await StudentQuizAttemptsService.getQuizAttemptsByCourseStats(studentId);
            res.json({ success: true, data: stats });
        } catch (error) {
            console.error('Error fetching quiz attempts stats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch quiz attempts statistics'
            });
        }
    }

    static async getAttemptDetails(req: Request, res: Response) {
        try {
            const {studentId} = req.params;
            const { attemptId } = req.params;
            const details = await StudentQuizAttemptsService.getQuizAttemptDetails(
                studentId,
                attemptId
            );
            res.json({ success: true, data: details });
        } catch (error) {
            console.error('Error fetching attempt details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch attempt details'
            });
        }
    }
}

