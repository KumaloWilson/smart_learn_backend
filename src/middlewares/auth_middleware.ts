import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user_service';
import rateLimit from 'express-rate-limit';
import { body, param, validationResult } from 'express-validator';

// Add user to request type
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Rate limiting configuration
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window per IP
    message: { error: 'Too many login attempts. Please try again later.' }
});

// Token verification middleware
export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const user = await UserService.verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Role-based access control middleware
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};


export const validateRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9@_.-]+$/)
        .withMessage('Username can only contain letters, numbers, @, underscores and hyphens'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('role')
        .isIn(['admin', 'student', 'lecturer'])
        .withMessage('Invalid role specified')
];

export const validateLogin = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
];

export const validatePasswordChange = [
    param('uid').isUUID().withMessage('Invalid user ID'),
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        .custom((value: any, { req }: any) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        })
];

// Validation error handler
export const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
