import { Request, Response } from 'express';
import { AdminSessionService } from '../services/admin_sessions_service';

export class AdminSessionController {
    static async getAllAdminSessions(req: Request, res: Response): Promise<void> {
        try {
            const sessions = await AdminSessionService.getAllAdminSessions();
            res.json(sessions);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAdminSessionById(req: Request, res: Response): Promise<void> {
        try {
            const { session_id } = req.params;
            const session = await AdminSessionService.getAdminSessionById(session_id);
            if (session) {
                res.json({
                    success: true,
                    message: 'Admin session found',
                    data: session
                });
            } else {
                res.status(404).json({ message: 'Session not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createAdminSession(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await AdminSessionService.createAdminSession(data);
            res.status(201).json({ success: true, message: 'Admin session created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateAdminSession(req: Request, res: Response): Promise<void> {
        try {
            const { session_id } = req.params;
            const data = req.body;
            await AdminSessionService.updateAdminSession(session_id, data);
            res.json({ success: true, message: 'Admin session updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteAdminSession(req: Request, res: Response): Promise<void> {
        try {
            const { session_id } = req.params;
            await AdminSessionService.deleteAdminSession(session_id);
            res.json({success: true, message: 'Admin session deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
