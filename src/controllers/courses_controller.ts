import { Request, Response } from 'express';
import { CourseService } from '../services/course_service';

export class CourseController {
    static async getAllCourses(req: Request, res: Response): Promise<void> {
        try {
            const courses = await CourseService.getAllCourses();
            res.json(courses);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getCourseById(req: Request, res: Response): Promise<void> {
        try {
            const { course_id } = req.params;
            const course = await CourseService.getCourseById(course_id);
            if (course) {
                res.json(course);
            } else {
                res.status(404).json({ message: 'Course not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createCourse(req: Request, res: Response): Promise<void> {
        try {
            const course = req.body;
            await CourseService.createCourse(course);
            res.status(201).json({ message: 'Course created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateCourse(req: Request, res: Response): Promise<void> {
        try {
            const { course_id } = req.params;
            const course = req.body;
            await CourseService.updateCourse(course_id, course);
            res.json({ message: 'Course updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteCourse(req: Request, res: Response): Promise<void> {
        try {
            const { course_id } = req.params;
            await CourseService.deleteCourse(course_id);
            res.json({ message: 'Course deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
