import { Request, Response } from 'express';
import { LecturerService } from '../services/lecturer_service';
import { UserService } from '../services/user_service';
import bcrypt from 'bcrypt';
import {User} from "../models/user";


export class LecturerController {
    static async getAllLecturers(req: Request, res: Response): Promise<void> {
        try {
            const lecturers = await LecturerService.getAllLecturers();
            res.json(
                {
                    success: true,
                    message: 'Lecturer profile and user account created successfully',
                    data: lecturers,
                }
            );
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getLecturerByUID(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_id } = req.params;
            const lecturer = await LecturerService.getLecturerByUID(lecturer_id);
            if (lecturer) {
                res.json(
                    {
                        success: true,
                        message: 'Lecturer profile and user account created successfully',
                        data: lecturer,
                    }
                );
            } else {
                res.status(404).json({ message: 'Lecturer not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createLecturer(req: Request, res: Response): Promise<void> {
        try {
            const lecturerData = req.body;
            // Check if user with email already exists
            const existingUser = await UserService.getUserByUsername(lecturerData.email_address);

            if (existingUser) {
                res.status(400).json({ error: 'User with the same email already exists' });
                return;
            }

            // Create the lecturer profile
            const createdLecturer = await LecturerService.createLecturer(lecturerData);


            if (!createdLecturer) {
                res.status(500).json({ error: 'Failed to create lecturer profile' });
                return;
            }



            const userData: Partial<User> = {
                uid: createdLecturer.lecturer_id,
                username: createdLecturer.email,
                password: 'Password123?',
                role: 'lecturer'
            };

            // Create the user account
            await UserService.createUserAuthAccount(userData);

            res.status(201).json({
                success: true,
                message: 'Lecturer profile and user account created successfully',
                lecturer: createdLecturer,
                userAccount: {
                    uid: createdLecturer.lecturer_id,
                    username: userData.username,
                    role: userData.role
                },
            });

        } catch (err) {
            console.error('Error creating lecturer and user account:', err);
            res.status(500).json({
                error: 'Failed to create lecturer and associated user account',
                details: err
            });
        }
    }

    static async updateLecturer(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_id } = req.params;
            const lecturer = req.body;
            await LecturerService.updateLecturer(lecturer_id, lecturer);
            res.json(
                {
                    success: true,
                    message: 'Lecturer updated successfully'
                }
            );
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteLecturer(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_id } = req.params;
            await LecturerService.deleteLecturer(lecturer_id);
            res.json(
                {
                    success: true,
                    message: 'Lecturer deleted successfully'
                }
                );
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
