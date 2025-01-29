import { Request, Response } from 'express';
import { StudentAcademicRecordService } from '../services/student_academic_records_service';

export class StudentAcademicRecordController {
    static async getAllRecords(req: Request, res: Response): Promise<void> {
        try {
            const records = await StudentAcademicRecordService.getAllRecords();
            res.json({
                success: true,
                data: records,
                message: 'All student academic records retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve student academic records.'
            });
        }
    }

    static async getRecordById(req: Request, res: Response): Promise<void> {
        try {
            const { record_id } = req.params;
            const record = await StudentAcademicRecordService.getRecordById(record_id);
            if (record) {
                res.json({
                    success: true,
                    data: record,
                    message: 'Student academic record retrieved successfully.'
                });
            } else {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Record not found.'
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve student academic record.'
            });
        }
    }

    static async createRecord(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await StudentAcademicRecordService.createRecord(data);
            res.status(201).json({
                success: true,
                data: null,
                message: 'Student academic record created successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to create student academic record.'
            });
        }
    }

    static async updateRecord(req: Request, res: Response): Promise<void> {
        try {
            const { record_id } = req.params;
            const data = req.body;
            await StudentAcademicRecordService.updateRecord(record_id, data);
            res.json({
                success: true,
                data: null,
                message: 'Student academic record updated successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to update student academic record.'
            });
        }
    }

    static async deleteRecord(req: Request, res: Response): Promise<void> {
        try {
            const { record_id } = req.params;
            await StudentAcademicRecordService.deleteRecord(record_id);
            res.json({
                success: true,
                data: null,
                message: 'Student academic record deleted successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to delete student academic record.'
            });
        }
    }
}
