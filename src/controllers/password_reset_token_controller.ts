import { Request, Response } from 'express';
import { PasswordResetTokenService } from '../services/password_reset_services';

export class PasswordResetTokenController {
    static async getAllTokens(req: Request, res: Response): Promise<void> {
        try {
            const tokens = await PasswordResetTokenService.getAllTokens();
            res.json({ success: true, data: tokens, message: 'Tokens retrieved successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async getTokenById(req: Request, res: Response): Promise<void> {
        try {
            const { token_id } = req.params;
            const token = await PasswordResetTokenService.getTokenById(token_id);
            if (token) {
                res.json({ success: true, data: token, message: 'Token retrieved successfully' });
            } else {
                res.status(404).json({ success: false, data: null, message: 'Token not found' });
            }
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async createToken(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await PasswordResetTokenService.createToken(data);
            res.status(201).json({ success: true, data: null, message: 'Password reset token created successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async updateToken(req: Request, res: Response): Promise<void> {
        try {
            const { token_id } = req.params;
            const data = req.body;
            await PasswordResetTokenService.updateToken(token_id, data);
            res.json({ success: true, data: null, message: 'Password reset token updated successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }

    static async deleteToken(req: Request, res: Response): Promise<void> {
        try {
            const { token_id } = req.params;
            await PasswordResetTokenService.deleteToken(token_id);
            res.json({ success: true, data: null, message: 'Password reset token deleted successfully' });
        } catch (err: any) {
            res.status(500).json({ success: false, data: null, message: err.message || 'An error occurred' });
        }
    }
}
