import { Router } from 'express';
import { PasswordResetTokenController } from '../controllers/password_reset_token_controller';

const router = Router();

router.get('/', PasswordResetTokenController.getAllTokens);
router.get('/:token_id', PasswordResetTokenController.getTokenById);
router.post('/', PasswordResetTokenController.createToken);
router.put('/:token_id', PasswordResetTokenController.updateToken);
router.delete('/:token_id', PasswordResetTokenController.deleteToken);


export default router;
