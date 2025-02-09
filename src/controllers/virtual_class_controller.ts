import { Request, Response } from 'express';
import { VirtualClassService } from '../services/virtual_class_service';
import {JitsiTokenService} from "../services/jitsi_token_service";


export class VirtualClassController {
    static async generateMeetingToken(req: Request, res: Response) {
        try {
            const { classId } = req.params;
            const { user } = req.body;


            const classDetails = await VirtualClassService.getClassById(classId);

            if (!classDetails) {
                return res.status(404).json({
                    success: false,
                    error: 'Virtual class not found'
                });
            }

            // Generate token for specific meeting room
            const token = JitsiTokenService.generateMeetingToken(
                classDetails.meeting_link,
                {
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            );

            res.status(200).json({
                success: true,
                data: {
                    token,
                    meeting_link: classDetails.meeting_link
                },
                message: 'Successfully generated meeting token'
            });
        } catch (error) {
            console.error('Token generation error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate meeting token'
            });
        }
    }


    static async createClass(req: Request, res: Response) {
        try {
            // Validate required fields
            const requiredFields = ['course_id', 'topic_id', 'title', 'start_time', 'end_time', 'created_by'];
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`
                });
            }


            const classData = req.body;
            const newClass = await VirtualClassService.createClass(classData);

            res.status(201).json({
                success: true,
                data: newClass,
                message: `Successfully created virtual class: ${newClass.title}`,
            });
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create virtual class'
            });
        }
    }

    static async getClassesByCourse(req: Request, res: Response) {
        try {
            const { courseId } = req.params;
            const classes = await VirtualClassService.getClassesByCourse(courseId);
            res.status(200).json({
                success: true,
                data: classes,
                message: `Successfully getting classes for course ${courseId}`,
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch classes' });
        }
    }


    static async getClassByClassId(req: Request, res: Response) {
        try {
            const { classId } = req.params;
            const classes = await VirtualClassService.getClassById(classId);
            res.status(200).json({
                success: true,
                data: classes,
                message: `Successfully got class ${classId}`,
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch class' });
        }
    }





    static async getUpcomingClasses(req: Request, res: Response) {
        try {
            const { lecturerId } = req.params;
            const classes = await VirtualClassService.getUpcomingClasses(lecturerId);
            res.status(200).json({
                success: true,
                data: classes,
                message: `Successfully getting classes for lecturer ${lecturerId}`,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch upcoming classes'
            });
        }
    }

    static async updateClassStatus(req: Request, res: Response) {
        try {
            const { classId } = req.params;
            const { status } = req.body;
            await VirtualClassService.updateClassStatus(classId, status);
            res.status(200).json({
                success: true,
                message: `Successfully updated ${classId}`,
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to update class status' });
        }
    }
}