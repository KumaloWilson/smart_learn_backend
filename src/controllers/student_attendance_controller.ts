import { Request, Response } from 'express';
import { StudentAttendanceService } from '../services/student_attendance_service';

export class StudentAttendanceController {
    static async getAllAttendances(req: Request, res: Response): Promise<void> {
        try {
            const attendances = await StudentAttendanceService.getAllAttendances();
            res.json(attendances);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getAttendanceById(req: Request, res: Response): Promise<void> {
        try {
            const { attendance_id } = req.params;
            const attendance = await StudentAttendanceService.getAttendanceById(attendance_id);
            if (attendance) {
                res.json(attendance);
            } else {
                res.status(404).json({ message: 'Attendance record not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createAttendance(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await StudentAttendanceService.createAttendance(data);
            res.status(201).json({ message: 'Attendance record created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateAttendance(req: Request, res: Response): Promise<void> {
        try {
            const { attendance_id } = req.params;
            const data = req.body;
            await StudentAttendanceService.updateAttendance(attendance_id, data);
            res.json({ message: 'Attendance record updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteAttendance(req: Request, res: Response): Promise<void> {
        try {
            const { attendance_id } = req.params;
            await StudentAttendanceService.deleteAttendance(attendance_id);
            res.json({ message: 'Attendance record deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
