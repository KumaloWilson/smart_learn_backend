import { Request, Response } from 'express';
import { PasswordResetTokenService } from '../services/password_reset_services';

export class PasswordResetTokenController {
    static async getAllTokens(req: Request, res: Response): Promise<void> {
        try {
            const tokens = await PasswordResetTokenService.getAllTokens();
            res.json(tokens);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getTokenById(req: Request, res: Response): Promise<void> {
        try {
            const { token_id } = req.params;
            const token = await PasswordResetTokenService.getTokenById(token_id);
            if (token) {
                res.json(token);
            } else {
                res.status(404).json({ message: 'Token not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createToken(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await PasswordResetTokenService.createToken(data);
            res.status(201).json({ message: 'Password reset token created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateToken(req: Request, res: Response): Promise<void> {
        try {
            const { token_id } = req.params;
            const data = req.body;
            await PasswordResetTokenService.updateToken(token_id, data);
            res.json({ message: 'Password reset token updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteToken(req: Request, res: Response): Promise<void> {
        try {
            const { token_id } = req.params;
            await PasswordResetTokenService.deleteToken(token_id);
            res.json({ message: 'Password reset token deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}