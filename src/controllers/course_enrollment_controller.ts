import { Request, Response } from 'express';
import { StudentCourseEnrollmentService } from '../services/course_enrollment_service';

export class StudentCourseEnrollmentController {
    static async getAllEnrollments(req: Request, res: Response): Promise<void> {
        try {
            const enrollments = await StudentCourseEnrollmentService.getAllEnrollments();
            res.json(enrollments);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getEnrollmentById(req: Request, res: Response): Promise<void> {
        try {
            const { enrollment_id } = req.params;
            const enrollment = await StudentCourseEnrollmentService.getEnrollmentById(enrollment_id);
            if (enrollment) {
                res.json(enrollment);
            } else {
                res.status(404).json({ message: 'Enrollment not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await StudentCourseEnrollmentService.createEnrollment(data);
            res.status(201).json({ message: 'Enrollment created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const { enrollment_id } = req.params;
            const data = req.body;
            await StudentCourseEnrollmentService.updateEnrollment(enrollment_id, data);
            res.json({ message: 'Enrollment updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const { enrollment_id } = req.params;
            await StudentCourseEnrollmentService.deleteEnrollment(enrollment_id);
            res.json({ message: 'Enrollment deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
