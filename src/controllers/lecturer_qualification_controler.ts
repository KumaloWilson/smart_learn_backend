import { Request, Response } from 'express';
import { LecturerQualificationService } from '../services/lecturer_qualification_service';

export class LecturerQualificationController {
    static async getAllLecturerQualifications(req: Request, res: Response): Promise<void> {
        try {
            const qualifications = await LecturerQualificationService.getAllLecturerQualifications();
            res.json(qualifications);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getLecturerQualificationById(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_qualification_id } = req.params;
            const qualification = await LecturerQualificationService.getLecturerQualificationById(lecturer_qualification_id);
            if (qualification) {
                res.json(qualification);
            } else {
                res.status(404).json({ message: 'Lecturer qualification not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createLecturerQualification(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await LecturerQualificationService.createLecturerQualification(data);
            res.status(201).json({ message: 'Lecturer qualification created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateLecturerQualification(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_qualification_id } = req.params;
            const data = req.body;
            await LecturerQualificationService.updateLecturerQualification(lecturer_qualification_id, data);
            res.json({ message: 'Lecturer qualification updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteLecturerQualification(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_qualification_id } = req.params;
            await LecturerQualificationService.deleteLecturerQualification(lecturer_qualification_id);
            res.json({ message: 'Lecturer qualification deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
