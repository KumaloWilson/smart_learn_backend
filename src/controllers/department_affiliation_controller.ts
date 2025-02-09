import { Request, Response } from 'express';
import { LecturerDepartmentAffiliationService } from '../services/department_affiliation_service';

export class LecturerDepartmentAffiliationController {
    static async getAllAffiliations(req: Request, res: Response): Promise<void> {
        try {
            const affiliations = await LecturerDepartmentAffiliationService.getAllAffiliations();
            res.json({
                success: true,
                message: 'Affiliations retrieved successfully',
                data: affiliations,
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAffiliationById(req: Request, res: Response): Promise<void> {
        try {
            const { affiliation_id } = req.params;
            const affiliation = await LecturerDepartmentAffiliationService.getAffiliationById(affiliation_id);
            if (affiliation) {
                res.json({
                    success: true,
                    message: 'Affiliation retrieved successfully',
                    data: affiliation,
                });
            } else {
                res.status(404).json({ success: false, message: 'Affiliation not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createAffiliation(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await LecturerDepartmentAffiliationService.createAffiliation(data);
            res.status(201).json({success: true, message: 'Affiliation created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateAffiliation(req: Request, res: Response): Promise<void> {
        try {
            const { affiliation_id } = req.params;
            const data = req.body;
            await LecturerDepartmentAffiliationService.updateAffiliation(affiliation_id, data);
            res.json({success: true, message: 'Affiliation updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteAffiliation(req: Request, res: Response): Promise<void> {
        try {
            const { affiliation_id } = req.params;
            await LecturerDepartmentAffiliationService.deleteAffiliation(affiliation_id);
            res.json({success: true, message: 'Affiliation deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
