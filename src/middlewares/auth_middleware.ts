// import { Request, Response, NextFunction } from 'express';
// import { verifyToken } from '../services/auth_service';

// export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//         const decodedToken = await verifyToken(token);
//         res.locals.user = decodedToken;
//         next();
//     } catch (error) {
//         console.error('Token verification failed:', error);
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// };

