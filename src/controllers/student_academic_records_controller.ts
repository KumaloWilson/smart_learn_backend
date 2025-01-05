import { Request, Response } from 'express';
import { StudentAcademicRecordService } from '../services/student_academic_records_service';

export class StudentAcademicRecordController {
    static async getAllRecords(req: Request, res: Response): Promise<void> {
        try {
            const records = await StudentAcademicRecordService.getAllRecords();
            res.json(records);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getRecordById(req: Request, res: Response): Promise<void> {
        try {
            const { record_id } = req.params;
            const record = await StudentAcademicRecordService.getRecordById(record_id);
            if (record) {
                res.json(record);
            } else {
                res.status(404).json({ message: 'Record not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createRecord(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await StudentAcademicRecordService.createRecord(data);
            res.status(201).json({ message: 'Record created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateRecord(req: Request, res: Response): Promise<void> {
        try {
            const { record_id } = req.params;
            const data = req.body;
            await StudentAcademicRecordService.updateRecord(record_id, data);
            res.json({ message: 'Record updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteRecord(req: Request, res: Response): Promise<void> {
        try {
            const { record_id } = req.params;
            await StudentAcademicRecordService.deleteRecord(record_id);
            res.json({ message: 'Record deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
