import express, { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user_controller';
import {
    loginLimiter,
    authenticateToken,
    authorizeRoles,
    validateRegistration,
    validateLogin,
    validatePasswordChange,
    handleValidationErrors
} from '../middlewares/auth_middleware';

const router = express.Router();

// Public routes
router.post(
    '/register',
    validateRegistration,
    handleValidationErrors,
    UserController.register
);

router.post(
    '/login',
    loginLimiter,
    validateLogin,
    handleValidationErrors,
    UserController.login
);

// Protected routes
router.post(
    '/change-password/:uid',
    authenticateToken,
    validatePasswordChange,
    handleValidationErrors,
    (req: Request, res: Response, next: NextFunction) => {
        // Ensure users can only change their own password (except admins)
        if (req.user.role !== 'admin' && req.user.uid !== req.params.uid) {
            return res.status(403).json({ error: 'You can only change your own password' });
        }
        next();
    },
    UserController.changePassword
);

// Admin-only routes
// router.get(
//     '/users',
//     authenticateToken,
//     authorizeRoles('admin'),
//     UserController.getAllUsers
// );
//
// router.get(
//     '/users/:uid',
//     authenticateToken,
//     authorizeRoles('admin'),
//     UserController.getUserById
// );
//
// router.put(
//     '/users/:uid',
//     authenticateToken,
//     authorizeRoles('admin'),
//     UserController.updateUser
// );
//
// router.delete(
//     '/users/:uid',
//     authenticateToken,
//     authorizeRoles('admin'),
//     UserController.deleteUser
// );
//
// // Account management routes
// router.post(
//     '/deactivate/:uid',
//     authenticateToken,
//     authorizeRoles('admin'),
//     async (req, res) => {
//         try {
//             await UserService.deactivateAccount(req.params.uid);
//             res.json({ message: 'Account deactivated successfully' });
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to deactivate account' });
//         }
//     }
// );
//
// router.post(
//     '/reactivate/:uid',
//     authenticateToken,
//     authorizeRoles('admin'),
//     async (req, res) => {
//         try {
//             await UserService.reactivateAccount(req.params.uid);
//             res.json({ message: 'Account reactivated successfully' });
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to reactivate account' });
//         }
//     }
// );

export default router;