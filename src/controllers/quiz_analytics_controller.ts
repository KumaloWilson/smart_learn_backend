import { Request, Response } from 'express';
import { LearningAnalyticsService } from '../services/learning_analytics_service';
import { InstructorAnalyticsService } from '../services/lecturer_analytics_service';

export class AnalyticsController {
    static async getGeneralStudentAnalytics(req: Request, res: Response) {
        try {
            const { student_id } = req.params;
            const analytics = await LearningAnalyticsService.getStudentAnalytics(student_id);
            res.json({
                success: true,
                data: analytics,
                message: 'Student analytics retrieved successfully.'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    static async getGeneralInstructorAnalytics(req: Request, res: Response) {
        try {
            const { course_id } = req.params;
            const analytics = await InstructorAnalyticsService.getCourseAnalytics(course_id);
            res.json({
                success: true,
                data: analytics,
                message: 'Instructor analytics retrieved successfully.'
            });
        } catch (error: any) {
            console.error(error);
            res.status(400).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    static async getQuizAttempts(req: Request, res: Response) {
        try {
            const { quiz_id } = req.params;
            const attempts = await InstructorAnalyticsService.getQuizAttemptsByQuizId(quiz_id);
            res.json({
                success: true,
                data: attempts
            });
        } catch (error) {
            console.error('Error fetching quiz attempts:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch quiz attempts'
            });
        }
    }

    static async getQuizAllAttemptsByStudent(req: Request, res: Response) {
        try {
            const { student_id } = req.params;
            const attempts = await InstructorAnalyticsService.getStudentQuizAttempts(student_id);
            res.json({
                success: true,
                data: attempts
            });
        } catch (error) {
            console.error('Error fetching student attempts:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch student attempts'
            });
        }
    }

    static async getQuizStatistics(req: Request, res: Response) {
        try {
            const { quiz_id } = req.params;
            const statistics = await InstructorAnalyticsService.getQuizStatistics(quiz_id);
            res.json({
                success: true,
                data: statistics
            });
        } catch (error) {
            console.error('Error fetching quiz statistics:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch quiz statistics'
            });
        }
    }


    static async getQuestionAnalysis(req: Request, res: Response) {
        try {
            const { quiz_id } = req.params;
            const analysis = await InstructorAnalyticsService.getQuestionAnalysis(quiz_id);
            res.json({
                success: true,
                data: analysis
            });
        } catch (error) {
            console.error('Error fetching question analysis:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch question analysis'
            });
        }
    }


}
