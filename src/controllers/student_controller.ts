import { Request, Response } from 'express';
import { StudentService } from '../services/student_service';
import { UserService } from '../services/user_service';
import bcrypt from 'bcrypt';


export class StudentController {
    static async getAllStudents(req: Request, res: Response): Promise<void> {
        try {
            const students = await StudentService.getAllStudents();
            res.json(students);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getStudentById(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            const student = await StudentService.getStudentByStudentID(student_id);
            if (student) {
                res.json(student);
            } else {
                res.status(404).json({ message: 'Student not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createStudent(req: Request, res: Response): Promise<void> {
        try {
            const studentData = req.body;
            const student_id = studentData.student_id;
            const DEFAULT_PASSWORD = "DefaultPassword";
            // Check if user with email already exists
            const existingUser = await UserService.getUserByUsername(student_id);
            if (existingUser) {
                res.status(400).json({ error: 'User with the same email already exists' });
                return;
            }

            // Create the student profile
            const createdStudent = await StudentService.createStudent(studentData);

            // Create corresponding user account for authentication

            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

            if (!createdStudent) {
                res.status(500).json({ error: 'Failed to create student profile' });
                return;
            }


            await UserService.createUserAuthAccount({ uid: student_id, username: createdStudent.student_id, role: "student", password: hashedPassword });

            res.status(201).json({
                message: 'Student profile and user account created successfully',
                student: createdStudent,
                userAccount: {
                    uid: student_id,
                    username: createdStudent.student_id,
                    role: 'student',
                },
            });

        } catch (err) {
            console.error('Error creating student and user account:', err);
            res.status(500).json({
                error: 'Failed to create student and associated user account',
                details: err
            });
        }
    }

    static async updateStudent(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            const student = req.body;
            await StudentService.updateStudent(student_id, student);
            res.json({ message: 'Student updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteStudent(req: Request, res: Response): Promise<void> {
        try {
            const { student_id } = req.params;
            await StudentService.deleteStudent(student_id);
            res.json({ message: 'Student deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
