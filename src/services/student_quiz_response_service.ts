// src/services/student-quiz-attempts.service.ts
import db from '../config/sql_config';
import { QuizAttempt } from '../models/quiz_attempt';
import {QuizSessionService} from "./quiz_session_service";

export class StudentQuizAttemptsService {
    /**
     * Get all quiz attempts for a student across all courses
     */
    static async getStudentQuizAttempts(studentId: string): Promise<QuizAttempt[]> {
        const [attempts]: any = await db.query(`
            SELECT 
                qa.*,
                q.course_id,
                q.topic,
                q.subtopic,
                q.difficulty,
                c.course_name
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.quiz_id
            JOIN courses c ON q.course_id = c.course_id
            WHERE qa.student_id = ?
            ORDER BY qa.start_time DESC
        `, [studentId]);

        return attempts;
    }

    /**
     * Get quiz attempts for a student in a specific course
     */
    static async getStudentCourseQuizAttempts(
        studentId: string,
        courseId: string
    ): Promise<QuizAttempt[]> {
        const [attempts]: any = await db.query(`
            SELECT 
                qa.*,
                q.topic,
                q.subtopic,
                q.difficulty,
                c.course_name
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.quiz_id
            JOIN courses c ON q.course_id = c.course_id
            WHERE qa.student_id = ?
            AND q.course_id = ?
            ORDER BY qa.start_time DESC
        `, [studentId, courseId]);

        return attempts;
    }

    /**
     * Get quiz attempts summary statistics by course
     */
    static async getQuizAttemptsByCourseStats(studentId: string): Promise<any[]> {
        const [stats]: any = await db.query(`
            SELECT 
                c.course_id,
                c.course_name,
                COUNT(DISTINCT qa.quiz_id) as total_quizzes_attempted,
                COUNT(qa.attempt_id) as total_attempts,
                AVG(qa.score) as average_score,
                COUNT(CASE WHEN qa.status = 'completed' THEN 1 END) as completed_attempts,
                COUNT(CASE WHEN qa.status = 'abandoned' THEN 1 END) as abandoned_attempts
            FROM courses c
            JOIN quizzes q ON c.course_id = q.course_id
            JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
            WHERE qa.student_id = ?
            GROUP BY c.course_id, c.course_name
            ORDER BY c.course_name
        `, [studentId]);

        return stats;
    }

    /**
     * Get detailed quiz attempt information including questions and responses
     */
    static async getQuizAttemptDetails(
        studentId: string,
        attemptId: string
    ): Promise<any> {
        // First verify the attempt belongs to the student
        const [attempt]: any = await db.query(`
            SELECT * FROM quiz_attempts 
            WHERE attempt_id = ? AND student_id = ?
        `, [attemptId, studentId]);

        if (!attempt.length) {
            throw new Error('Quiz attempt not found or unauthorized');
        }

        return QuizSessionService.getQuizSessionDetails(attemptId);
    }
}
