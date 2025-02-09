import db from '../config/sql_config';
import { VirtualClass } from '../models/virtual_class';
import { v4 as uuidv4 } from 'uuid';

export class VirtualClassService {

    static async createClass(classData: Omit<VirtualClass, 'id' | 'meeting_link' | 'status'>): Promise<VirtualClass> {
        // Validate required fields
        if (!classData.course_id || !classData.title || !classData.start_time || !classData.end_time || !classData.created_by) {
            throw new Error('Missing required fields');
        }

        const id = uuidv4();
        const meeting_link = `virtual-class-${id}`;

        // Convert undefined values to null for SQL
        const topic_id = classData.topic_id || null;
        const description = classData.description || null;
        const is_recurring = classData.is_recurring || false;
        const recurrence_pattern = classData.recurrence_pattern || null;

        const query = `
            INSERT INTO virtual_classes 
            (id, course_id, topic_id, title, description, start_time, end_time,
            meeting_link, created_by, is_recurring, recurrence_pattern, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.execute(query, [
            id,
            classData.course_id,
            topic_id,
            classData.title,
            description,
            new Date(classData.start_time),
            new Date(classData.end_time),
            meeting_link,
            classData.created_by,
            is_recurring,
            recurrence_pattern,
            'scheduled'
        ]);

        return {
            id,
            meeting_link,
            status: 'scheduled' as const,
            ...classData,
        };
    }

    static async getClassesByCourse(courseId: string): Promise<VirtualClass[]> {
        const query = `
            SELECT * FROM virtual_classes 
            WHERE course_id = ? 
            ORDER BY start_time DESC
        `;
        const [rows] = await db.execute(query, [courseId]);
        return rows as VirtualClass[];
    }

    static async getUpcomingClasses(lecturerId: string): Promise<VirtualClass[]> {
        const query = `
            SELECT vc.* 
            FROM virtual_classes vc
            JOIN courses lc ON vc.course_id = lc.course_id
            WHERE lc.lecturer_id = ? 
            AND vc.start_time > NOW()
            AND vc.status = 'scheduled'
            ORDER BY vc.start_time ASC
        `;
        const [rows] = await db.execute(query, [lecturerId]);
        return rows as VirtualClass[];
    }


    static async updateClassStatus(classId: string, status: VirtualClass['status']): Promise<void> {
        const query = `
            UPDATE virtual_classes 
            SET status = ?
            WHERE id = ?
        `;
        await db.execute(query, [status, classId]);
    }

    static async getClassById(classId: string): Promise<VirtualClass | null> {
        const query = `
            SELECT * FROM virtual_classes 
            WHERE id = ?
        `;
        const [rows]: any = await db.execute(query, [classId]);

        if (rows.length === 0) {
            return null;
        }

        return rows[0] as VirtualClass;
    }


}
