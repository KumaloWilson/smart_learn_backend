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

    static async getCourseByProgramId(program_id: string): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses WHERE program_id = ?', [program_id]);
        return rows as Course[];
    }

    static async getCoursesByProgramIdAndLevel(program_id: string, level: string): Promise<Course[]> {

        const [rows] = await db.query(
            'SELECT * FROM courses WHERE program_id = ? AND course_level = ?',
            [program_id, level]
        );
        return rows as Course[];
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

    static async getCoursesByStatus(status: string): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses WHERE status = ?', [status]);
        return rows as Course[];
    }

    static async getCoursesByElectiveStatus(is_elective: boolean): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses WHERE is_elective = ?', [is_elective]);
        return rows as Course[];
    }

    static async getCoursesByPhase(phase: number): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses WHERE phase = ?', [phase]);
        return rows as Course[];
    }

    static async getCoursesBySemesterOffered(semester_offered: string): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses WHERE semester_offered = ?', [semester_offered]);
        return rows as Course[];
    }

    static async getCoursesByLevel(level: string): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses WHERE course_level = ?', [level]);
        return rows as Course[];
    }

    static async getCoursesByPrerequisites(prerequisites: string): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses WHERE prerequisites LIKE ?', [`%${prerequisites}%`]);
        return rows as Course[];
    }

    static async getCoursesByCreditHours(credit_hours: number): Promise<Course[]> {
        const [rows] = await db.query('SELECT * FROM courses WHERE credit_hours = ?', [credit_hours]);
        return rows as Course[];
    }
}
