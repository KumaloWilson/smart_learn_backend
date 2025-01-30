import { Request, Response } from 'express';
import { StudentCourseService } from '../services/course_enrollment_service';

export class StudentCourseController {
    // Get all courses for a student
    static async getStudentCourses(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            const courses = await StudentCourseService.getStudentCourses(student_id);
            res.json({
                success: true,
                message: 'Student courses found successfully',
                data: courses
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    // Get current semester courses
    static async getCurrentEnrolledSemesterCourses(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            const courses = await StudentCourseService.getCurrentEnrolledSemesterCourses(student_id);
            res.json({
                success: true,
                message: 'Enrolled courses found successfully',
                data: courses
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    // Get current students on courses
    static async getEnrolledStudentsByCourse(req: Request, res: Response): Promise<void> {
        try {
            const { course_id } = req.params;
            const courses = await StudentCourseService.getCourseEnrollmentDetails(course_id);
            res.json({
                success: true,
                message: 'Enrolled students found successfully',
                data: courses
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    // Get course history with grades
    static async getStudentCourseHistory(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            const courseHistory = await StudentCourseService.getStudentCourseHistory(student_id);
            res.json({
                success: true,
                message: 'Student courses history found successfully',
                data: courseHistory
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    // Get semester GPA
    static async getStudentSemesterGPA(req: Request, res: Response): Promise<void> {
        try {
            const { student_id, academic_year, semester } = req.params;
            const gpa = await StudentCourseService.getStudentSemesterGPA(
                student_id,
                academic_year,
                semester
            );
            res.json({
                success: true,
                message: 'Student courses found successfully',
                data: gpa
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    // Enroll in a course
    static async enrollStudentInCourse(req: Request, res: Response): Promise<void> {
        try {
            const enrollment = req.body;
            await StudentCourseService.enrollStudentInCourse(enrollment);
            res.status(201).json({ success: true, message: 'Enrollment successful' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async bulkEnrollStudentInCourses(req: Request, res: Response): Promise<void> {
        try {
            const enrollments = req.body;

            // Validate request body
            if (!Array.isArray(enrollments) || enrollments.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid request body. Expected non-empty array of enrollments'
                });
                return;
            }

            await StudentCourseService.bulkEnrollInCourses(enrollments);
            res.status(201).json({ message: 'Bulk enrollment successful' });
        } catch (err: any) {
            if (err.message.includes('already enrolled')) {
                res.status(409).json({
                    success: false,
                    message: err.message
                });
            } else {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: err.message || 'Failed to process bulk enrollment'
                });
            }
        }
    }

    // Update enrollment
    static async updateEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const { enrollment_id } = req.params;
            const updates = req.body;
            await StudentCourseService.updateStudentCourseEnrollment(enrollment_id, updates);
            res.json({ success: true, message: 'Enrollment updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}