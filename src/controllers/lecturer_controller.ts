import { Request, Response } from 'express';
import { LecturerService } from '../services/lecturer_service';
import { UserService } from '../services/user_service';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


export class LecturerController {
    static async getAllLecturers(req: Request, res: Response): Promise<void> {
        try {
            const lecturers = await LecturerService.getAllLecturers();
            res.json(lecturers);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getLecturerByUID(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_id } = req.params;
            const lecturer = await LecturerService.getLecturerByUID(lecturer_id);
            if (lecturer) {
                res.json(lecturer);
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
            const uid = uuidv4();

            // Add the uid to lecturer data
            const lecturerWithUID = {
                ...lecturerData,
                uid
            };


            // Check if user with email already exists
            const existingUser = await UserService.getUserByUsername(lecturerData.email_address);

            if (existingUser) {
                res.status(400).json({ error: 'User with the same email already exists' });
                return;
            }

            // Create the lecturer profile
            const createdLecturer = await LecturerService.createLecturer(lecturerWithUID);

            // Create corresponding user account for authentication
            const DEFAULT_PASSWORD = "Welcome123!";
            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);


            if (!createdLecturer) {
                res.status(500).json({ error: 'Failed to create lecturer profile' });
                return;
            }



            const userData = {
                uid,
                username: createdLecturer.email_address,
                password: hashedPassword,
                role: 'lecturer'
            };

            // Create the user account
            await UserService.createUserAuthAccount(userData);

            res.status(201).json({
                message: 'Lecturer profile and user account created successfully',
                lecturer: createdLecturer,
                userAccount: {
                    uid,
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
            res.json({ message: 'Lecturer updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteLecturer(req: Request, res: Response): Promise<void> {
        try {
            const { lecturer_id } = req.params;
            await LecturerService.deleteLecturer(lecturer_id);
            res.json({ message: 'Lecturer deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
