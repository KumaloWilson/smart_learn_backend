import { Request, Response } from 'express';
import { SchoolService } from '../services/school_service';

export class SchoolController {
    static async getAllSchools(req: Request, res: Response): Promise<void> {
        try {
            const schools = await SchoolService.getAllSchools();
            res.json({
                success: true,
                data: schools,
                message: 'All schools retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve schools.'
            });
        }
    }

    static async getSchoolById(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            const school = await SchoolService.getSchoolById(school_id);
            if (school) {
                res.json({
                    success: true,
                    data: school,
                    message: 'School retrieved successfully.'
                });
            } else {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'School not found.'
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve school.'
            });
        }
    }

    static async createSchool(req: Request, res: Response): Promise<void> {
        try {
            const school = req.body;
            await SchoolService.createSchool(school);
            res.status(201).json({
                success: true,
                data: null,
                message: 'School created successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to create school.'
            });
        }
    }

    static async updateSchool(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            const school = req.body;
            await SchoolService.updateSchool(school_id, school);
            res.json({
                success: true,
                data: null,
                message: 'School updated successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to update school.'
            });
        }
    }

    static async deleteSchool(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            await SchoolService.deleteSchool(school_id);
            res.json({
                success: true,
                data: null,
                message: 'School deleted successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to delete school.'
            });
        }
    }
}
