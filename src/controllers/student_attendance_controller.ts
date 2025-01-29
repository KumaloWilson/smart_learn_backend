import { Request, Response } from 'express';
import { StudentAttendanceService } from '../services/student_attendance_service';

export class StudentAttendanceController {
    static async getAllAttendances(req: Request, res: Response): Promise<void> {
        try {
            const attendances = await StudentAttendanceService.getAllAttendances();
            res.json({
                success: true,
                data: attendances,
                message: 'All attendance records retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve attendance records.'
            });
        }
    }

    static async getAttendanceById(req: Request, res: Response): Promise<void> {
        try {
            const { attendance_id } = req.params;
            const attendance = await StudentAttendanceService.getAttendanceById(attendance_id);
            if (attendance) {
                res.json({
                    success: true,
                    data: attendance,
                    message: 'Attendance record retrieved successfully.'
                });
            } else {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Attendance record not found.'
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve attendance record.'
            });
        }
    }

    static async createAttendance(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await StudentAttendanceService.createAttendance(data);
            res.status(201).json({
                success: true,
                data: null,
                message: 'Attendance record created successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to create attendance record.'
            });
        }
    }

    static async updateAttendance(req: Request, res: Response): Promise<void> {
        try {
            const { attendance_id } = req.params;
            const data = req.body;
            await StudentAttendanceService.updateAttendance(attendance_id, data);
            res.json({
                success: true,
                data: null,
                message: 'Attendance record updated successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to update attendance record.'
            });
        }
    }

    static async deleteAttendance(req: Request, res: Response): Promise<void> {
        try {
            const { attendance_id } = req.params;
            await StudentAttendanceService.deleteAttendance(attendance_id);
            res.json({
                success: true,
                data: null,
                message: 'Attendance record deleted successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to delete attendance record.'
            });
        }
    }
}
