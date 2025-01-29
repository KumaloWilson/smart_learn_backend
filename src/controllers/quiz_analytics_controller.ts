import { Request, Response } from 'express';
import { LearningAnalyticsService } from '../services/learning_analytics_service';
import { InstructorAnalyticsService } from '../services/lecturer_analytics_service';

export class AnalyticsController {
    static async getStudentAnalytics(req: Request, res: Response) {
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

    static async getInstructorAnalytics(req: Request, res: Response) {
        try {
            const { course_id } = req.params;
            const analytics = await InstructorAnalyticsService.getCourseAnalytics(course_id);
            res.json({
                success: true,
                data: analytics,
                message: 'Instructor analytics retrieved successfully.'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }
}
