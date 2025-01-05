import db from '../config/sql_config';
import { Course } from '../models/course';

export class CourseService {
    static async getAllCourses(): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses');
        return rows as Course[];
    }

    static async getCourseById(course_id: string): Promise<Course | null> {
        const [rows]: any = await db.query('SELECT * FROM courses WHERE course_id = ?', [course_id]);
        return rows[0] || null;
    }

    static async createCourse(course: Course): Promise<void> {
        const sql = `INSERT INTO courses SET ?`;
        await db.query(sql, course);
    }

    static async updateCourse(course_id: string, course: Partial<Course>): Promise<void> {
        const sql = `UPDATE courses SET ? WHERE course_id = ?`;
        await db.query(sql, [course, course_id]);
    }

    static async deleteCourse(course_id: string): Promise<void> {
        await db.query('DELETE FROM courses WHERE course_id = ?', [course_id]);
    }
}
