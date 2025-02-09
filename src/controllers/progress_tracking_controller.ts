
// controllers/progress_tracking_controller.ts
import { Request, Response } from 'express';
import { ProgressTrackingService } from '../services/progress_tracking_service';


export class ProgressTrackingController {
    static async getStudentProgress(req: Request, res: Response) {
        try {
            const { student_id, course_id } = req.params;
            const progress = await ProgressTrackingService.getStudentProgress(student_id, course_id);
            res.status(200).json(progress);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getTopicMastery(req: Request, res: Response) {
        try {
            const { student_id, topic } = req.params;
            const mastery = await ProgressTrackingService.getTopicMastery(student_id, topic);
            res.status(200).json(mastery);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async generateStudyPlan(req: Request, res: Response) {
        try {
            const { student_id, course_id } = req.params;
            const studyPlan = await ProgressTrackingService.generateStudyPlan(student_id, course_id);
            res.status(200).json(studyPlan);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}