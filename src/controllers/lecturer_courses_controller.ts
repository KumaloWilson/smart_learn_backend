import { Request, Response } from 'express';
import { LecturerCourseAssignmentService } from '../services/lecturer_courses_service';

export class LecturerCourseAssignmentController {
    static async getAllAssignments(req: Request, res: Response): Promise<void> {
        try {
            const assignments = await LecturerCourseAssignmentService.getAllAssignments();
            res.json(assignments);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAssignmentById(req: Request, res: Response): Promise<void> {
        try {
            const { assignment_id } = req.params;
            const assignment = await LecturerCourseAssignmentService.getAssignmentById(assignment_id);
            if (assignment) {
                res.json(assignment);
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
            res.status(201).json({ message: 'Assignment created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateAssignment(req: Request, res: Response): Promise<void> {
        try {
            const { assignment_id } = req.params;
            const data = req.body;
            await LecturerCourseAssignmentService.updateAssignment(assignment_id, data);
            res.json({ message: 'Assignment updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteAssignment(req: Request, res: Response): Promise<void> {
        try {
            const { assignment_id } = req.params;
            await LecturerCourseAssignmentService.deleteAssignment(assignment_id);
            res.json({ message: 'Assignment deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}