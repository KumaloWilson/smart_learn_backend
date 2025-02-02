import { Request, Response } from 'express';
import { CourseTopicService } from '../services/course_topics_service';

export class CourseTopicController {
    static async getAllTopics(req: Request, res: Response): Promise<void> {
        try {
            const topics = await CourseTopicService.getAllTopics();
            res.json({
                success: true,
                message: 'All topics retrieved successfully',
                data: topics,
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getTopicById(req: Request, res: Response): Promise<void> {
        try {
            const { topic_id } = req.params;
            const topic = await CourseTopicService.getTopicById(topic_id);
            if (topic) {
                res.json({
                    success: true,
                    message: 'Topic retrieved successfully',
                    data: topic,
                });
            } else {
                res.status(404).json({ message: 'Topic not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getTopicsByCourseId(req: Request, res: Response): Promise<void> {
        try {
            const { course_id } = req.params;
            const topics = await CourseTopicService.getTopicsByCourseId(course_id);
            res.json({
                success: true,
                message: 'Topics retrieved successfully',
                data: topics,
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createTopic(req: Request, res: Response): Promise<void> {
        try {
            const topic = req.body;
            await CourseTopicService.createTopic(topic);
            res.status(201).json({ success: true, message: 'Topic created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateTopic(req: Request, res: Response): Promise<void> {
        try {
            const { topic_id } = req.params;
            const topic = req.body;
            await CourseTopicService.updateTopic(topic_id, topic);
            res.json({ success: true, message: 'Topic updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteTopic(req: Request, res: Response): Promise<void> {
        try {
            const { topic_id } = req.params;
            await CourseTopicService.deleteTopic(topic_id);
            res.json({ success: true, message: 'Topic deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getTopicsByCourseIdAndName(req: Request, res: Response): Promise<void> {
        try {
            const { course_id, topic_name } = req.params;
            const topics = await CourseTopicService.getTopicsByCourseIdAndName(course_id, topic_name);
            res.json({
                success: true,
                message: 'Topics retrieved successfully',
                data: topics,
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
