import express from 'express';
import { loginUser, registerUser } from '../controllers/auth_controller';

const router = express.Router();

router.post('/verifyLogin', loginUser);
router.post('/register', registerUser);

export default router;
