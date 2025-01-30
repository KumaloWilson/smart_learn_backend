import { Request, Response } from 'express';
import { LecturerCourseAssignmentService } from '../services/lecturer_courses_service';

export class LecturerCourseAssignmentController {
    static async getAllAssignments(req: Request, res: Response): Promise<void> {
        try {
            const assignments = await LecturerCourseAssignmentService.getAllAssignments();
            res.json(
                {
                    success: true,
                    message: 'Course Assigned successfully retrieved',
                    data: assignments,

                }
            );
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAssignmentsByLecturerId(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_id } = req.params;
            const assignments = await LecturerCourseAssignmentService.getAssignmentsByLecturerId(lecturer_id);
            res.json({
                success: true,
                message: 'Courses Assigned successfully retrieved',
                data: assignments,

            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAssignmentById(req: Request, res: Response): Promise<void> {
        try {
            const { assignment_id } = req.params;
            const assignment = await LecturerCourseAssignmentService.getAssignmentById(assignment_id);
            if (assignment) {
                res.json({
                    success: true,
                    message: 'Course Assigned successfully retrieved',
                    data: assignment,

                });
            } else {
                res.status(404).json({ message: 'Assignment not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createAssignment(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await LecturerCourseAssignmentService.createAssignment(data);
            res.status(201).json({ success: true, message: 'Assignment created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateAssignment(req: Request, res: Response): Promise<void> {
        try {
            const { assignment_id } = req.params;
            const data = req.body;
            await LecturerCourseAssignmentService.updateAssignment(assignment_id, data);
            res.json({ success: true, message: 'Assignment updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteAssignment(req: Request, res: Response): Promise<void> {
        try {
            const { assignment_id } = req.params;
            await LecturerCourseAssignmentService.deleteAssignment(assignment_id);
            res.json({ success: true, message: 'Assignment deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAssignmentsBySemesterAndYear(req: Request, res: Response): Promise<void> {
        try {
            const { semester, academic_year } = req.params;
            const assignments = await LecturerCourseAssignmentService.getAssignmentsBySemesterAndYear(semester, academic_year);
            res.json({
                success: true,
                message: 'Assignments retrieved successfully',
                data: assignments,
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async bulkCreateAssignments(req: Request, res: Response): Promise<void> {
        try {
            const assignments = req.body;
            await LecturerCourseAssignmentService.bulkCreateAssignments(assignments);
            res.status(201).json({ success: true, message: 'Assignments created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async bulkUpdateAssignments(req: Request, res: Response): Promise<void> {
        try {
            const assignments = req.body;
            await LecturerCourseAssignmentService.bulkUpdateAssignments(assignments);
            res.json({ success: true, message: 'Assignments updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
