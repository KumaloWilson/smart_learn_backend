import { Request, Response } from 'express';
import { StudentService } from '../services/student_service';
import { UserService } from '../services/user_service';
import bcrypt from 'bcrypt';
import { User } from "../models/user";

export class StudentController {
    static async getAllStudents(req: Request, res: Response): Promise<void> {
        try {
            const students = await StudentService.getAllStudents();
            res.json({
                success: true,
                data: students,
                message: 'All students retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve students.',
            });
        }
    }

    static async getStudentById(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            const student = await StudentService.getStudentByStudentID(student_id);
            if (student) {
                res.json({
                    success: true,
                    data: student,
                    message: 'Student retrieved successfully.'
                });
            } else {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Student not found.'
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve student.',
            });
        }
    }

    static async getStudentProfileByStudentID(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            const student = await StudentService.getStudentProfileByStudentID(student_id);
            if (student) {
                res.json({
                    success: true,
                    data: student,
                    message: 'Student profile retrieved successfully.'
                });
            } else {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Student profile not found.'
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve student profile.',
            });
        }
    }

    static async createStudent(req: Request, res: Response): Promise<void> {
        try {
            const studentData = req.body;
            const student_id = studentData.student_id;

            // Check if user with email already exists
            const existingUser = await UserService.getUserByUsername(student_id);
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    data: null,
                    message: 'User with the same email already exists.'
                });
                return;
            }

            // Create the student profile
            const createdStudent = await StudentService.createStudent(studentData);

            // Create corresponding user account for authentication
            if (!createdStudent) {
                res.status(500).json({
                    success: false,
                    data: null,
                    message: 'Failed to create student profile.'
                });
                return;
            }

            const userData: Partial<User> = {
                uid: student_id,
                username: student_id,
                password: 'Password123?',
                role: 'student'
            };

            await UserService.createUserAuthAccount(userData);

            res.status(201).json({
                success: true,
                data: {
                    student: createdStudent,
                    userAccount: {
                        uid: student_id,
                        username: createdStudent.student_id,
                        role: 'student',
                    }
                },
                message: 'Student profile and user account created successfully.'
            });
        } catch (err) {
            console.error('Error creating student and user account:', err);
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to create student and associated user account.',
                details: err
            });
        }
    }

    static async updateStudent(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            const student = req.body;
            await StudentService.updateStudent(student_id, student);
            res.json({
                success: true,
                data: null,
                message: 'Student updated successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to update student.',
            });
        }
    }

    static async deleteStudent(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            await StudentService.deleteStudent(student_id);
            res.json({
                success: true,
                data: null,
                message: 'Student deleted successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to delete student.',
            });
        }
    }
}
