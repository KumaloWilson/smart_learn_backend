import db from '../config/sql_config';


export class InstructorAnalyticsService {
    static async getCourseAnalytics(course_id: string): Promise<any> {
        const [topicPerformance]: any = await db.query(`
            WITH TopicStats AS (
                SELECT 
                    t.topic_id,
                    t.name as topic_name,
                    COUNT(DISTINCT sp.student_id) as students_attempted,
                    AVG(sp.mastery_level) as avg_mastery_level,
                    COUNT(DISTINCT CASE WHEN sp.mastery_level >= 70 THEN sp.student_id END) as students_mastered
                FROM topics t
                JOIN subtopics s ON t.topic_id = s.topic_id
                LEFT JOIN student_progress sp ON s.subtopic_id = sp.subtopic_id
                WHERE t.course_id = ?
                GROUP BY t.topic_id, t.name
            )
            SELECT 
                topic_id,
                topic_name,
                avg_mastery_level,
                (students_mastered / NULLIF(students_attempted, 0)) * 100 as mastery_rate,
                students_attempted
            FROM TopicStats
        `, [course_id]);

        const [commonMisconceptions]: any = await db.query(`
            SELECT 
                t.name as topic_name,
                s.name as subtopic_name,
                mt.misconception_type,
                COUNT(DISTINCT mt.student_id) as affected_students
            FROM misconception_tracking mt
            JOIN subtopics s ON mt.subtopic_id = s.subtopic_id
            JOIN topics t ON s.topic_id = t.topic_id
            WHERE t.course_id = ?
            GROUP BY t.name, s.name, mt.misconception_type
            HAVING COUNT(DISTINCT mt.student_id) > 5
            ORDER BY affected_students DESC
        `, [course_id]);

        return {
            topicPerformance,
            commonMisconceptions,
            recommendedInterventions: this.generateInterventions(topicPerformance, commonMisconceptions)
        };
    }

    private static generateInterventions(topicPerformance: any[], commonMisconceptions: any[]): string[] {
        const interventions: string[] = [];

        // Generate interventions based on topic performance
        topicPerformance.forEach(topic => {
            if (topic.avg_mastery_level < 70) {
                interventions.push(`Review teaching methods for ${topic.topic_name} - current mastery level: ${topic.avg_mastery_level.toFixed(1)}%`);
            }
            if (topic.mastery_rate < 50) {
                interventions.push(`Consider additional support materials for ${topic.topic_name}`);
            }
        });

        // Generate interventions based on common misconceptions
        commonMisconceptions.forEach(misconception => {
            if (misconception.affected_students > 10) {
                interventions.push(`Address common misconception in ${misconception.subtopic_name}: ${misconception.misconception_type}`);
            }
        });

        return interventions;
    }
}