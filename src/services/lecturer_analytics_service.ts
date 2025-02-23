import db from '../config/sql_config';
import { CourseEngagement } from '../models/course_engagement';
import { LecturerTopicPerformance } from '../models/lecturer_perfomance';
import { QuizAnalytics } from '../models/quiz_analytics';
import {StudentPerformance} from "../models/student_perfomance";

export class InstructorAnalyticsService {
    static async getCourseAnalytics(course_id: string): Promise<any> {
        const [topicPerformance] = await this.getTopicPerformance(course_id);
        const [quizAnalytics] = await this.getQuizAnalytics(course_id);
        const [courseEngagement] = await this.getCourseEngagement(course_id);
        const [commonMisconceptions] = await this.getMisconceptions(course_id);
        const [progressTrends] = await this.getProgressTrends(course_id);

        return {
            topicPerformance,
            quizAnalytics,
            courseEngagement,
            commonMisconceptions,
            progressTrends,
            recommendedInterventions: this.generateInterventions(
                topicPerformance,
                commonMisconceptions,
                courseEngagement,
                quizAnalytics
            )
        };
    }

    private static async getTopicPerformance(course_id: string): Promise<any> {
        return db.query(`
            WITH TopicStats AS (
                SELECT 
                    ct.topic_id,
                    ct.topic_name,
                    ct.topic_number,
                    COUNT(DISTINCT qa.student_id) as students_attempted,
                    AVG(qa.score) as avg_quiz_score,
                    COUNT(DISTINCT CASE WHEN qa.score >= 70 THEN qa.student_id END) as students_mastered,
                    SUM(CASE WHEN q.difficulty = 'easy' THEN 1 ELSE 0 END) as easy_count,
                    SUM(CASE WHEN q.difficulty = 'medium' THEN 1 ELSE 0 END) as medium_count,
                    SUM(CASE WHEN q.difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count
                FROM course_topics ct
                LEFT JOIN quizzes q ON ct.topic_id = q.topic
                LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
                WHERE ct.course_id = ?
                GROUP BY ct.topic_id, ct.topic_name, ct.topic_number
            )
            SELECT 
                topic_id,
                topic_name,
                topic_number,
                avg_quiz_score as avg_mastery_level,
                (students_mastered / NULLIF(students_attempted, 0)) * 100 as mastery_rate,
                students_attempted,
                JSON_OBJECT(
                    'easy', IFNULL(easy_count, 0),
                    'medium', IFNULL(medium_count, 0),
                    'hard', IFNULL(hard_count, 0)
                ) as difficulty_distribution
            FROM TopicStats
            ORDER BY topic_number
        `, [course_id]);
    }

    private static async getQuizAnalytics(course_id: string): Promise<any> {
        return db.query(`
            SELECT 
                q.quiz_id,
                q.subtopic,
                q.difficulty,
                AVG(qa.score) as avg_score,
                COUNT(qa.attempt_id) as attempt_count,
                COUNT(CASE WHEN qa.status = 'completed' THEN 1 END) / COUNT(*) * 100 as completion_rate,
                AVG(TIMESTAMPDIFF(MINUTE, qa.start_time, qa.end_time)) as avg_duration
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
            WHERE q.course_id = ?
            GROUP BY q.quiz_id, q.topic, q.difficulty
            ORDER BY avg_score DESC
        `, [course_id]);
    }

    private static async getCourseEngagement(course_id: string): Promise<any> {
        return db.query(`
            WITH StudentEngagement AS (
                SELECT 
                    qa.student_id,
                    COUNT(qa.attempt_id) as total_attempts,
                    AVG(qa.score) as avg_score,
                    COUNT(DISTINCT q.subtopic) as topics_attempted
                FROM quiz_attempts qa
                JOIN quizzes q ON qa.quiz_id = q.quiz_id
                WHERE q.course_id = ?
                GROUP BY qa.student_id
            )
            SELECT 
                COUNT(DISTINCT student_id) as total_students,
                COUNT(DISTINCT CASE WHEN total_attempts > 0 THEN student_id END) as active_students,
                COUNT(DISTINCT CASE WHEN avg_score < 60 THEN student_id END) as at_risk_students,
                AVG(total_attempts) as avg_quiz_attempts,
                AVG(topics_attempted) / (SELECT COUNT(*) FROM course_topics WHERE course_id = ?) * 100 as completion_rate
            FROM StudentEngagement
        `, [course_id, course_id]);
    }

    private static async getProgressTrends(course_id: string): Promise<any> {
        return db.query(`
            SELECT 
                DATE(qa.start_time) as date,
                COUNT(DISTINCT qa.student_id) as active_students,
                AVG(qa.score) as avg_daily_score,
                COUNT(qa.attempt_id) as total_attempts
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.quiz_id
            WHERE q.course_id = ?
            GROUP BY DATE(qa.start_time)
            ORDER BY date
        `, [course_id]);
    }

    private static async getMisconceptions(course_id: string): Promise<any> {
        return db.query(`
            SELECT 
                q.subtopic,
                qa.quiz_id,
                COUNT(DISTINCT CASE WHEN qa.score < 60 THEN qa.student_id END) as struggling_students,
                AVG(CASE WHEN qa.score < 60 THEN qa.score END) as avg_failing_score
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.quiz_id
            WHERE q.course_id = ?
            GROUP BY q.topic, qa.quiz_id
            HAVING struggling_students > 5
            ORDER BY struggling_students DESC
        `, [course_id]);
    }

    private static generateInterventions(
        topicPerformance: LecturerTopicPerformance[],
        commonMisconceptions: any[],
        courseEngagement: CourseEngagement,
        quizAnalytics: QuizAnalytics[]
    ): string[] {
        const interventions: string[] = [];

        // Helper function to safely format numbers
        const safeToFixed = (num: number | null | undefined, digits: number = 1): string => {
            if (num === null || num === undefined || isNaN(num)) {
                return 'N/A';
            }
            return num.toFixed(digits);
        };

        // Topic-based interventions
        topicPerformance?.forEach(topic => {
            if (topic && topic.topic_name) {
                if (topic.avg_mastery_level !== null && topic.avg_mastery_level < 70) {
                    interventions.push(
                        `Priority Review Required: ${topic.topic_name} - current mastery level: ${safeToFixed(topic.avg_mastery_level)}%`
                    );
                }
                if (topic.mastery_rate !== null && topic.mastery_rate < 50) {
                    interventions.push(
                        `Additional Support Needed: Only ${safeToFixed(topic.mastery_rate)}% of students have mastered ${topic.topic_name}`
                    );
                }
            }
        });

        // Engagement-based interventions
        if (courseEngagement) {
            const atRiskRatio = courseEngagement.at_risk_students && courseEngagement.total_students ?
                courseEngagement.at_risk_students / courseEngagement.total_students : 0;

            if (atRiskRatio > 0.2) {
                interventions.push(
                    `High Risk Alert: ${courseEngagement.at_risk_students} students are performing below 60% average`
                );
            }

            if (courseEngagement.completion_rate !== null && courseEngagement.completion_rate < 70) {
                interventions.push(
                    `Low Course Completion: Only ${safeToFixed(courseEngagement.completion_rate)}% of course content attempted`
                );
            }
        }

        // Quiz-based interventions
        quizAnalytics?.forEach(quiz => {
            if (quiz && quiz.topic) {
                if (quiz.completion_rate !== null && quiz.completion_rate < 80) {
                    interventions.push(
                        `Low Quiz Completion: ${quiz.topic} - ${safeToFixed(quiz.completion_rate)}% completion rate`
                    );
                }
                if (quiz.avg_score !== null && quiz.avg_score < 65) {
                    interventions.push(
                        `Review Quiz Content: ${quiz.topic} (${quiz.difficulty || 'N/A'}) - average score ${safeToFixed(quiz.avg_score)}%`
                    );
                }
            }
        });

        return interventions;
    }


    /////////////////////////////////////////////////////////////////////////////////

    static async getQuizAttemptsByQuizId(quiz_id: string): Promise<StudentPerformance[]> {
        const query = `
            SELECT 
                qa.*,
                s.first_name,
                s.last_name,
                s.registration_number,
                s.email,
                s.enrollment_status,
                q.topic,
                q.total_questions,
                q.time_limit,
                COUNT(DISTINCT qa2.attempt_id) as attempt_number,
                (
                    SELECT COUNT(*)
                    FROM question_responses qr
                    WHERE qr.attempt_id = qa.attempt_id
                    AND qr.is_correct = true
                ) as questions_correct,
                TIMESTAMPDIFF(SECOND, qa.start_time, COALESCE(qa.end_time, CURRENT_TIMESTAMP)) as time_spent
            FROM quiz_attempts qa
            JOIN students s ON qa.student_id = s.student_id
            JOIN quizzes q ON qa.quiz_id = q.quiz_id
            LEFT JOIN quiz_attempts qa2 ON 
                qa2.quiz_id = qa.quiz_id AND 
                qa2.student_id = qa.student_id AND 
                qa2.attempt_id <= qa.attempt_id
            WHERE qa.quiz_id = ?
            GROUP BY qa.attempt_id
            ORDER BY qa.start_time DESC
        `;

        const [attempts]: any = await db.query(query, [quiz_id]);

        return attempts.map((attempt: any) => ({
            ...attempt,
            student_name: `${attempt.first_name} ${attempt.last_name}`,
            time_spent: attempt.time_spent || null,
            questions_correct: attempt.questions_correct || 0
        }));
    }

    /**
     * Get all attempts by a specific student across all quizzes
     */
    static async getStudentQuizAttempts(student_id: string): Promise<StudentPerformance[]> {
        const query = `
            SELECT 
                qa.*,
                s.first_name,
                s.last_name,
                s.registration_number,
                s.email,
                s.enrollment_status,
                q.topic,
                q.total_questions,
                q.time_limit,
                COUNT(DISTINCT qa2.attempt_id) as attempt_number,
                (
                    SELECT COUNT(*)
                    FROM question_responses qr
                    WHERE qr.attempt_id = qa.attempt_id
                    AND qr.is_correct = true
                ) as questions_correct,
                TIMESTAMPDIFF(SECOND, qa.start_time, COALESCE(qa.end_time, CURRENT_TIMESTAMP)) as time_spent
            FROM quiz_attempts qa
            JOIN students s ON qa.student_id = s.student_id
            JOIN quizzes q ON qa.quiz_id = q.quiz_id
            LEFT JOIN quiz_attempts qa2 ON 
                qa2.quiz_id = qa.quiz_id AND 
                qa2.student_id = qa.student_id AND 
                qa2.attempt_id <= qa.attempt_id
            WHERE qa.student_id = ?
            GROUP BY qa.attempt_id
            ORDER BY qa.start_time DESC
        `;

        const [attempts]: any = await db.query(query, [student_id]);

        return attempts.map((attempt: any) => ({
            ...attempt,
            student_name: `${attempt.first_name} ${attempt.last_name}`,
            time_spent: attempt.time_spent || null,
            questions_correct: attempt.questions_correct || 0
        }));
    }

    /**
     * Get quiz performance statistics
     */
    static async getQuizStatistics(quiz_id: string) {
        const query = `
            SELECT 
                COUNT(DISTINCT qa.student_id) as total_students,
                COUNT(qa.attempt_id) as total_attempts,
                ROUND(AVG(qa.score), 2) as average_score,
                MIN(qa.score) as lowest_score,
                MAX(qa.score) as highest_score,
                SUM(CASE WHEN qa.status = 'completed' THEN 1 ELSE 0 END) as completed_attempts,
                SUM(CASE WHEN qa.status = 'abandoned' THEN 1 ELSE 0 END) as abandoned_attempts,
                ROUND(AVG(
                    TIMESTAMPDIFF(SECOND, qa.start_time, COALESCE(qa.end_time, CURRENT_TIMESTAMP))
                ), 0) as average_completion_time
            FROM quiz_attempts qa
            WHERE qa.quiz_id = ?
        `;

        const [statistics]: any = await db.query(query, [quiz_id]);
        return statistics[0];
    }

    /**
     * Get detailed question analysis for a quiz
     */
    static async getQuestionAnalysis(quiz_id: string) {
        const query = `
            SELECT 
                q.question_id,
                q.text as question_text,
                COUNT(qr.response_id) as total_attempts,
                SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END) as correct_answers,
                ROUND(AVG(qr.time_taken), 2) as average_time_taken,
                ROUND((SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END) / COUNT(qr.response_id)) * 100, 2) as success_rate
            FROM questions q
            LEFT JOIN question_responses qr ON q.question_id = qr.question_id
            WHERE q.quiz_id = ?
            GROUP BY q.question_id
            ORDER BY success_rate DESC
        `;

        const [questions]: any = await db.query(query, [quiz_id]);
        return questions;
    }
}