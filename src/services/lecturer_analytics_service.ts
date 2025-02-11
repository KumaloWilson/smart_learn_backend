import db from '../config/sql_config';
import { CourseEngagement } from '../models/course_engagement';
import { LecturerTopicPerformance } from '../models/lecturer_perfomance';
import { QuizAnalytics } from '../models/quiz_analytics';

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

        // Topic-based interventions
        topicPerformance.forEach(topic => {
            if (topic.avg_mastery_level < 70) {
                interventions.push(`Priority Review Required: ${topic.topic_name} - current mastery level: ${topic.avg_mastery_level.toFixed(1)}%`);
            }
            if (topic.mastery_rate < 50) {
                interventions.push(`Additional Support Needed: Only ${topic.mastery_rate.toFixed(1)}% of students have mastered ${topic.topic_name}`);
            }
        });

        // Engagement-based interventions
        if (courseEngagement.at_risk_students / courseEngagement.total_students > 0.2) {
            interventions.push(`High Risk Alert: ${courseEngagement.at_risk_students} students are performing below 60% average`);
        }
        if (courseEngagement.completion_rate < 70) {
            interventions.push(`Low Course Completion: Only ${courseEngagement.completion_rate.toFixed(1)}% of course content attempted`);
        }

        // Quiz-based interventions
        quizAnalytics.forEach(quiz => {
            if (quiz.completion_rate < 80) {
                interventions.push(`Low Quiz Completion: ${quiz.topic} - ${quiz.completion_rate.toFixed(1)}% completion rate`);
            }
            if (quiz.avg_score < 65) {
                interventions.push(`Review Quiz Content: ${quiz.topic} (${quiz.difficulty}) - average score ${quiz.avg_score.toFixed(1)}%`);
            }
        });

        return interventions;
    }
}