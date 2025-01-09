


import db from '../config/sql_config'
import { TopicAnalytics } from '../models/quiz_topic_analytics';

export class ProgressTrackingService {
    static async getTopicAnalytics(student_id: string, topic: string): Promise<TopicAnalytics> {
        try {
            const [[analytics], [mistakes]] = await Promise.all([
                db.query(`
                    SELECT 
                        q.topic,
                        q.subtopic,
                        q.difficulty,
                        AVG(qa.is_correct) as success_rate,
                        AVG(qa.time_taken) as average_time,
                        COUNT(DISTINCT qa.attempt_id) as attempt_count
                    FROM questions q
                    JOIN quiz_answers qa ON q.question_id = qa.question_id
                    WHERE q.topic = ? AND qa.student_id = ?
                    GROUP BY q.topic, q.subtopic, q.difficulty
                `, [topic, student_id]),

                db.query(`
                    SELECT DISTINCT q.misconception
                    FROM questions q
                    JOIN quiz_answers qa ON q.question_id = qa.question_id
                    WHERE q.topic = ? 
                    AND qa.student_id = ?
                    AND qa.is_correct = false
                    LIMIT 5
                `, [topic, student_id])
            ]);

            if (!analytics) throw new Error('No analytics found');

            const mastery_level = this.calculateMasteryLevel(
                analytics.success_rate,
                analytics.attempt_count
            );

            return {
                ...analytics,
                mastery_level,
                common_mistakes: mistakes.map(m => m.misconception),
                average_score: analytics.success_rate * 100
            };
        } catch (error) {
            throw new Error(`Failed to get topic analytics: ${error.message}`);
        }
    }

    private static calculateMasteryLevel(successRate: number, attemptCount: number): 'novice' | 'intermediate' | 'expert' {
        if (successRate > 0.8 && attemptCount > 5) return 'expert';
        if (successRate > 0.6 || attemptCount > 10) return 'intermediate';
        return 'novice';
    }

    static async generateStudyPlan(student_id: string, course_id: string): Promise<{
        topics: Array<{
            topic: string;
            focus_areas: string[];
            recommended_difficulty: string;
            estimated_time: number;
        }>;
        total_time: number;
    }> {
        try {
            const [weakTopics] = await db.query(`
                WITH TopicPerformance AS (
                    SELECT 
                        q.topic,
                        q.subtopic,
                        AVG(qa.is_correct) as success_rate,
                        COUNT(DISTINCT qa.attempt_id) as attempts
                    FROM questions q
                    JOIN quiz_answers qa ON q.question_id = qa.question_id
                    WHERE q.course_id = ? AND qa.student_id = ?
                    GROUP BY q.topic, q.subtopic
                    HAVING success_rate < 0.7
                )
                SELECT * FROM TopicPerformance
                ORDER BY success_rate ASC, attempts ASC
                LIMIT 5
            `, [course_id, student_id]);

            const studyPlan = weakTopics.map(topic => ({
                topic: topic.topic,
                focus_areas: [topic.subtopic],
                recommended_difficulty: topic.success_rate < 0.4 ? 'easy' : 'medium',
                estimated_time: Math.ceil((0.7 - topic.success_rate) * 30)
            }));

            return {
                topics: studyPlan,
                total_time: studyPlan.reduce((sum, topic) => sum + topic.estimated_time, 0)
            };
        } catch (error) {
            throw new Error(`Failed to generate study plan: ${error.message}`);
        }
    }
}