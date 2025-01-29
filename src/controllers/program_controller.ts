import { Request, Response } from 'express';
import { ProgramService } from '../services/program_service';

export class ProgramController {
    static async getAllPrograms(req: Request, res: Response): Promise<void> {
        try {
            const programs = await ProgramService.getAllPrograms();
            res.json({ success: true, data: programs, message: 'Programs retrieved successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async getProgramById(req: Request, res: Response): Promise<void> {
        try {
            const { program_id } = req.params;
            const program = await ProgramService.getProgramById(program_id);
            if (program) {
                res.json({ success: true, data: program, message: 'Program retrieved successfully' });
            } else {
                res.status(404).json({ success: false, data: null, message: 'Program not found' });
            }
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async getProgramsBySchoolId(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            console.log('School ID:', school_id);
            const programs = await ProgramService.getProgramsBySchoolId(school_id);
            if (programs.length === 0) {
                res.status(404).json({ success: false, data: null, message: 'No programs found for the given school ID.' });
            } else {
                res.json({ success: true, data: programs, message: 'Programs retrieved successfully' });
            }
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async createProgram(req: Request, res: Response): Promise<void> {
        try {
            const program = req.body;
            await ProgramService.createProgram(program);
            res.status(201).json({ success: true, data: null, message: 'Program created successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async updateProgram(req: Request, res: Response): Promise<void> {
        try {
            const { program_id } = req.params;
            const program = req.body;
            await ProgramService.updateProgram(program_id, program);
            res.json({ success: true, data: null, message: 'Program updated successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async deleteProgram(req: Request, res: Response): Promise<void> {
        try {
            const { program_id } = req.params;
            await ProgramService.deleteProgram(program_id);
            res.json({ success: true, data: null, message: 'Program deleted successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }
}
