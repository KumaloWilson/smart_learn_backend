import { Request, Response } from 'express';
import { QualificationTypeService } from '../services/qualification_types_service';

export class QualificationTypeController {
    static async getAllQualificationTypes(req: Request, res: Response): Promise<void> {
        try {
            const qualifications = await QualificationTypeService.getAllQualificationTypes();
            res.json(qualifications);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getQualificationTypeById(req: Request, res: Response): Promise<void> {
        try {
            const { qualification_id } = req.params;
            const qualification = await QualificationTypeService.getQualificationTypeById(qualification_id);
            if (qualification) {
                res.json(qualification);
            } else {
                res.status(404).json({ message: 'Qualification type not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createQualificationType(req: Request, res: Response): Promise<void> {
        try {
            const qualification = req.body;
            await QualificationTypeService.createQualificationType(qualification);
            res.status(201).json({ message: 'Qualification type created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateQualificationType(req: Request, res: Response): Promise<void> {
        try {
            const { qualification_id } = req.params;
            const qualification = req.body;
            await QualificationTypeService.updateQualificationType(qualification_id, qualification);
            res.json({ message: 'Qualification type updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteQualificationType(req: Request, res: Response): Promise<void> {
        try {
            const { qualification_id } = req.params;
            await QualificationTypeService.deleteQualificationType(qualification_id);
            res.json({ message: 'Qualification type deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
