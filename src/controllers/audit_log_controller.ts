import { Request, Response } from 'express';
import { AuditLogService } from '../services/audit_log_service';

export class AuditLogController {
    static async getAllAuditLogs(req: Request, res: Response): Promise<void> {
        try {
            const logs = await AuditLogService.getAllAuditLogs();
            res.json(logs);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAuditLogById(req: Request, res: Response): Promise<void> {
        try {
            const { log_id } = req.params;
            const log = await AuditLogService.getAuditLogById(log_id);
            if (log) {
                res.json({
                    success: true,
                    message: 'Audit log found successfully',
                    data: log
                });
            } else {
                res.status(404).json({ message: 'Audit log not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createAuditLog(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await AuditLogService.createAuditLog(data);
            res.status(201).json({ success: true, message: 'Audit log created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateAuditLog(req: Request, res: Response): Promise<void> {
        try {
            const { log_id } = req.params;
            const data = req.body;
            await AuditLogService.updateAuditLog(log_id, data);
            res.json({ success: true, message: 'Audit log updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteAuditLog(req: Request, res: Response): Promise<void> {
        try {
            const { log_id } = req.params;
            await AuditLogService.deleteAuditLog(log_id);
            res.json({success: true, message: 'Audit log deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
