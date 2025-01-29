import { Request, Response } from 'express';
import { LecturerQualificationService } from '../services/lecturer_qualification_service';

export class LecturerQualificationController {
    static async getAllLecturerQualifications(req: Request, res: Response): Promise<void> {
        try {
            const qualifications = await LecturerQualificationService.getAllLecturerQualifications();
            res.json({ success: true, data: qualifications, message: 'Lecturer qualifications retrieved successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async getLecturerQualificationById(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_qualification_id } = req.params;
            const qualification = await LecturerQualificationService.getLecturerQualificationById(lecturer_qualification_id);
            if (qualification) {
                res.json({ success: true, data: qualification, message: 'Lecturer qualification retrieved successfully' });
            } else {
                res.status(404).json({ success: false, data: null, message: 'Lecturer qualification not found' });
            }
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async createLecturerQualification(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await LecturerQualificationService.createLecturerQualification(data);
            res.status(201).json({ success: true, data: null, message: 'Lecturer qualification created successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async updateLecturerQualification(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_qualification_id } = req.params;
            const data = req.body;
            await LecturerQualificationService.updateLecturerQualification(lecturer_qualification_id, data);
            res.json({ success: true, data: null, message: 'Lecturer qualification updated successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async deleteLecturerQualification(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_qualification_id } = req.params;
            await LecturerQualificationService.deleteLecturerQualification(lecturer_qualification_id);
            res.json({ success: true, data: null, message: 'Lecturer qualification deleted successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }
}
