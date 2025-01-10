import db from '../config/sql_config';
import { Request, Response } from 'express';

export class ProgressController {
    static async getStudentProgress(req: Request, res: Response) {
        try {
            const { student_id, course_id } = req.params;

            const [progress]: any = await db.query(`
                WITH CourseProgress AS (
                    SELECT 
                        sp.student_id,
                        t.topic_id,
                        t.name as topic_name,
                        AVG(sp.mastery_level) as topic_mastery,
                        COUNT(DISTINCT qa.attempt_id) as attempts_made,
                        MAX(qa.score) as highest_score
                    FROM topics t
                    JOIN subtopics s ON t.topic_id = s.topic_id
                    LEFT JOIN student_progress sp ON s.subtopic_id = sp.subtopic_id
                    LEFT JOIN quizzes q ON s.subtopic_id = q.subtopic_id
                    LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
                    WHERE t.course_id = ? AND sp.student_id = ?
                    GROUP BY sp.student_id, t.topic_id, t.name
                )
                SELECT 
                    topic_id,
                    topic_name,
                    topic_mastery,
                    attempts_made,
                    highest_score,
                    CASE 
                        WHEN topic_mastery >= 90 THEN 'Mastered'
                        WHEN topic_mastery >= 70 THEN 'Proficient'
                        WHEN topic_mastery >= 50 THEN 'Developing'
                        ELSE 'Needs Improvement'
                    END as mastery_status
                FROM CourseProgress
            `, [course_id, student_id]);

            res.json({
                overall_progress: progress.reduce((acc: number, p: any) => acc + p.topic_mastery, 0) / progress.length,
                topics: progress
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}