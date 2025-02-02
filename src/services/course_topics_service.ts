import db from '../config/sql_config';
import { CourseTopic } from '../models/course_topic';  // Assuming you have a CourseTopic model

export class CourseTopicService {
    // Get all topics
    static async getAllTopics(): Promise<CourseTopic[]> {
        const [rows] = await db.query('SELECT * FROM course_topics');
        return rows as CourseTopic[];
    }

    // Get a topic by ID
    static async getTopicById(topic_id: string): Promise<CourseTopic | null> {
        const [rows]: any = await db.query('SELECT * FROM course_topics WHERE topic_id = ?', [topic_id]);
        return rows[0] || null;
    }



    // Get topics by course ID
    static async getTopicsByCourseId(course_id: string): Promise<CourseTopic[]> {
        const [rows] = await db.query('SELECT * FROM course_topics WHERE course_id = ? ORDER BY topic_number', [course_id]);
        return rows as CourseTopic[];
    }

    // Create a new topic
    static async createTopic(topic: CourseTopic): Promise<void> {
        const sql = `INSERT INTO course_topics SET ?`;
        await db.query(sql, topic);
    }

    // Update an existing topic
    static async updateTopic(topic_id: string, topic: Partial<CourseTopic>): Promise<void> {
        const sql = `UPDATE course_topics SET ? WHERE topic_id = ?`;
        await db.query(sql, [topic, topic_id]);
    }

    // Delete a topic by ID
    static async deleteTopic(topic_id: string): Promise<void> {
        await db.query('DELETE FROM course_topics WHERE topic_id = ?', [topic_id]);
    }

    // Get topics by course ID and topic name
    static async getTopicsByCourseIdAndName(course_id: string, topic_name: string): Promise<CourseTopic[]> {
        const [rows] = await db.query('SELECT * FROM course_topics WHERE course_id = ? AND topic_name = ?', [course_id, topic_name]);
        return rows as CourseTopic[];
    }
}
