// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ error: 'No token provided' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// };

// export const authenticateStudent = (req: Request, res: Response, next: NextFunction) => {
//     authenticateUser(req, res, () => {
//         if (req.user?.role !== 'student') {
//             return res.status(403).json({ error: 'Access denied. Students only.' });
//         }
//         next();
//     });
// };

// export const authenticateInstructor = (req: Request, res: Response, next: NextFunction) => {
//     authenticateUser(req, res, () => {
//         if (req.user?.role !== 'instructor') {
//             return res.status(403).json({ error: 'Access denied. Instructors only.' });
//         }
//         next();
//     });
// };
