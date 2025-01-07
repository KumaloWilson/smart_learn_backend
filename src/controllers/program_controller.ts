import { Request, Response } from 'express';
import { ProgramService } from '../services/program_service';

export class ProgramController {
    static async getAllPrograms(req: Request, res: Response): Promise<void> {
        try {
            const programs = await ProgramService.getAllPrograms();
            res.json(programs);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getProgramById(req: Request, res: Response): Promise<void> {
        try {
            const { program_id } = req.params;
            const program = await ProgramService.getProgramById(program_id);
            if (program) {
                res.json(program);
            } else {
                res.status(404).json({ message: 'Program not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getProgramsBySchoolId(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            console.log('School ID:', school_id);
            const programs = await ProgramService.getProgramsBySchoolId(school_id);
            if (programs.length === 0) {
                res.status(404).json({ message: 'No programs found for the given school ID.' });
            }
            res.json(programs);

        } catch (err) {
            console.error(err); // Log any error
            res.status(500).json({ error: err });
        }
    }



    static async createProgram(req: Request, res: Response): Promise<void> {
        try {
            const program = req.body;
            await ProgramService.createProgram(program);
            res.status(201).json({ message: 'Program created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateProgram(req: Request, res: Response): Promise<void> {
        try {
            const { program_id } = req.params;
            const program = req.body;
            await ProgramService.updateProgram(program_id, program);
            res.json({ message: 'Program updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteProgram(req: Request, res: Response): Promise<void> {
        try {
            const { program_id } = req.params;
            await ProgramService.deleteProgram(program_id);
            res.json({ message: 'Program deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
