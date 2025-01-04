import express from 'express';
import { UserController } from '../controllers/user_controller';

const router = express.Router();

router.post('/authenticate', UserController.loginUser);
router.post('/register', UserController.registerUser);
router.post('/verify_password', UserController.verifyPassword)

export default router;
