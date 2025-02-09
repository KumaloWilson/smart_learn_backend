import { Request, Response } from 'express';
import { QualificationTypeService } from '../services/qualification_types_service';

export class QualificationTypeController {
    static async getAllQualificationTypes(req: Request, res: Response): Promise<void> {
        try {
            const qualifications = await QualificationTypeService.getAllQualificationTypes();
            res.json({ success: true, data: qualifications, message: 'Qualification types retrieved successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async getQualificationTypeById(req: Request, res: Response): Promise<void> {
        try {
            const { qualification_id } = req.params;
            const qualification = await QualificationTypeService.getQualificationTypeById(qualification_id);
            if (qualification) {
                res.json({ success: true, data: qualification, message: 'Qualification type retrieved successfully' });
            } else {
                res.status(404).json({ success: false, data: null, message: 'Qualification type not found' });
            }
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async createQualificationType(req: Request, res: Response): Promise<void> {
        try {
            const qualification = req.body;
            await QualificationTypeService.createQualificationType(qualification);
            res.status(201).json({ success: true, data: null, message: 'Qualification type created successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async updateQualificationType(req: Request, res: Response): Promise<void> {
        try {
            const { qualification_id } = req.params;
            const qualification = req.body;
            await QualificationTypeService.updateQualificationType(qualification_id, qualification);
            res.json({ success: true, data: null, message: 'Qualification type updated successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async deleteQualificationType(req: Request, res: Response): Promise<void> {
        try {
            const { qualification_id } = req.params;
            await QualificationTypeService.deleteQualificationType(qualification_id);
            res.json({ success: true, data: null, message: 'Qualification type deleted successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }
}
