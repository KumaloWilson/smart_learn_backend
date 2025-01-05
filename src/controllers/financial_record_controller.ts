import { Request, Response } from 'express';
import { StudentFinancialRecordService } from '../services/financial_record_service';

export class StudentFinancialRecordController {
    static async getAllFinancialRecords(req: Request, res: Response): Promise<void> {
        try {
            const records = await StudentFinancialRecordService.getAllFinancialRecords();
            res.json(records);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getFinancialRecordById(req: Request, res: Response): Promise<void> {
        try {
            const { finance_id } = req.params;
            const record = await StudentFinancialRecordService.getFinancialRecordById(finance_id);
            if (record) {
                res.json(record);
            } else {
                res.status(404).json({ message: 'Financial record not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createFinancialRecord(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await StudentFinancialRecordService.createFinancialRecord(data);
            res.status(201).json({ message: 'Financial record created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateFinancialRecord(req: Request, res: Response): Promise<void> {
        try {
            const { finance_id } = req.params;
            const data = req.body;
            await StudentFinancialRecordService.updateFinancialRecord(finance_id, data);
            res.json({ message: 'Financial record updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteFinancialRecord(req: Request, res: Response): Promise<void> {
        try {
            const { finance_id } = req.params;
            await StudentFinancialRecordService.deleteFinancialRecord(finance_id);
            res.json({ message: 'Financial record deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
