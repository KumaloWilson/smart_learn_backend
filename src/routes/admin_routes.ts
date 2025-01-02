import express from 'express';
//import { verifyToken } from '../middlewares/auth_middleware';
import { AdminController } from '../controllers/admin_controller';

const router = express.Router();

const adminController = new AdminController();

// Admin Routes
router.get('/getAdminProfile/:uid', adminController.getProfile.bind(adminController));
router.post('/addAdminProfile', adminController.createProfile.bind(adminController));
router.put('/modifyAdmin/:uid', adminController.updateProfile.bind(adminController));
router.delete('/deleteAdmin/:uid', adminController.deleteProfile.bind(adminController));

export default router;
