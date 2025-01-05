import { Request, Response } from 'express';
import { SchoolService } from '../services/school_service';

export class SchoolController {
    static async getAllSchools(req: Request, res: Response): Promise<void> {
        try {
            const schools = await SchoolService.getAllSchools();
            res.json(schools);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getSchoolById(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            const school = await SchoolService.getSchoolById(school_id);
            if (school) {
                res.json(school);
            } else {
                res.status(404).json({ message: 'School not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createSchool(req: Request, res: Response): Promise<void> {
        try {
            const school = req.body;
            await SchoolService.createSchool(school);
            res.status(201).json({ message: 'School created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateSchool(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            const school = req.body;
            await SchoolService.updateSchool(school_id, school);
            res.json({ message: 'School updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteSchool(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            await SchoolService.deleteSchool(school_id);
            res.json({ message: 'School deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
