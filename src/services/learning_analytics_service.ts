import { v4 as uuidv4 } from 'uuid';
import db from '../config/sql_config';
import { StudentAnalytics } from '../models/student_analytics';
import { StudentTopicPerformance } from '../models/student_sub_topic_perfomance';
import { StudentCoursePerformance } from '../models/student_topic_perfomance';

export class LearningAnalyticsService {
    // Fetch comprehensive student analytics with error handling
    static async getStudentAnalytics(student_id: string): Promise<StudentAnalytics> {
        try {
            // Validate student_id
            if (!student_id) {
                throw new Error('Invalid student ID');
            }

            // Get overall progress with error handling
            const progressRows = await this.fetchOverallProgress(student_id);

            // Get topic performances
            const topicPerformances = await this.getTopicPerformances(student_id);

            // Identify weak and strong areas with more robust filtering
            const weakAreas = this.identifyWeakAreas(topicPerformances);
            const strongAreas = this.identifyStrongAreas(topicPerformances);

            // Generate personalized learning path
            const learningPath = await this.generateLearningPath(student_id, topicPerformances);

            return {
                student_id,
                overall_progress: progressRows[0]?.overall_progress ?? 0,
                topic_performances: topicPerformances,
                learning_path: learningPath,
                weak_areas: weakAreas,
                strong_areas: strongAreas
            };
        } catch (error) {
            console.error('Error fetching student analytics:', error);
            throw new Error(`Failed to retrieve student analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Fetch overall progress with improved error handling
    private static async fetchOverallProgress(student_id: string): Promise<any[]> {
        try {
            const [progressRows]: any = await db.query(`
                SELECT AVG(COALESCE(mastery_level, 0)) as overall_progress
                FROM student_progress
                WHERE student_id = ?
            `, [student_id]);

            return progressRows ?? [{ overall_progress: 0 }];
        } catch (error) {
            console.error('Error fetching overall progress:', error);
            return [{ overall_progress: 0 }];
        }
    }

    // More robust topic performance retrieval
    private static async getTopicPerformances(student_id: string): Promise<StudentCoursePerformance[]> {
        try {
            const [rows]: any = await db.query(`
                SELECT 
                    ct.topic_id,
                    ct.topic_name,
                    COALESCE(AVG(qa.score), 0) as average_score,
                    COALESCE(COUNT(DISTINCT qa.quiz_id) / NULLIF(COUNT(DISTINCT q.quiz_id), 0), 0) as completion_rate
                FROM course_topics ct
                JOIN quizzes q ON ct.topic_name = q.subtopic
                LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id AND qa.student_id = ?
                GROUP BY ct.topic_id, ct.topic_name
            `, [student_id]);

            const topicPerformances: StudentCoursePerformance[] = [];

            for (const row of rows) {
                const subtopicPerformances = await this.getSubtopicPerformances(student_id, row.topic_id);

                topicPerformances.push({
                    topic_id: row.topic_id,
                    topic_name: row.topic_name,
                    average_score: row.average_score,
                    completion_rate: row.completion_rate,
                    weak_subtopics: subtopicPerformances.filter(sp => sp.mastery_level < 70),
                    strong_subtopics: subtopicPerformances.filter(sp => sp.mastery_level >= 90),
                    recommended_actions: await this.generateRecommendedActions(student_id, row.topic_id)
                });
            }

            return topicPerformances;
        } catch (error) {
            console.error('Error fetching topic performances:', error);
            return [];
        }
    }


    private static async getSubtopicPerformances(student_id: string, topic_id: string): Promise<StudentTopicPerformance[]> {
        try {
            const [rows]: any = await db.query(`
            SELECT 
                ct.topic_id as subtopic_id,
                q.subtopic as subtopic_name,
                COALESCE(sp.mastery_level, 0) as mastery_level,
                COALESCE(sp.attempts_count, 0) as attempts_count,
                mt.misconception_type
            FROM quizzes q
            JOIN course_topics ct ON q.subtopic = ct.topic_name
            LEFT JOIN student_progress sp ON ct.topic_id = sp.subtopic_id AND sp.student_id = ?
            LEFT JOIN misconception_tracking mt ON ct.topic_id = mt.subtopic_id AND mt.student_id = ?
            WHERE q.topic = ?
            GROUP BY ct.topic_id, q.subtopic, sp.mastery_level, sp.attempts_count, mt.misconception_type
        `, [student_id, student_id, topic_id]);

            const subtopicMap = new Map<string, StudentTopicPerformance>();

            rows.forEach((row: any) => {
                if (!subtopicMap.has(row.subtopic_id)) {
                    subtopicMap.set(row.subtopic_id, {
                        subtopic_id: row.subtopic_id,
                        subtopic_name: row.subtopic_name,
                        mastery_level: row.mastery_level,
                        attempts_count: row.attempts_count,
                        common_misconceptions: [],
                        improvement_areas: []
                    });
                }

                if (row.misconception_type) {
                    subtopicMap.get(row.subtopic_id)!.common_misconceptions.push(row.misconception_type);
                }
            });

            // Generate improvement areas for each subtopic
            for (const subtopic of subtopicMap.values()) {
                subtopic.improvement_areas = await this.generateImprovementAreas(subtopic);
            }

            return Array.from(subtopicMap.values());
        } catch (error) {
            console.error('Error fetching subtopic performances:', error);
            return [];
        }
    }


    // Robust improvement areas generation
    private static async generateImprovementAreas(subtopic: StudentTopicPerformance): Promise<string[]> {
        const improvementAreas: string[] = [];

        if (subtopic.mastery_level < 70) {
            improvementAreas.push('Review core concepts');
            improvementAreas.push('Practice more questions');
        }

        if (subtopic.common_misconceptions.length > 0) {
            improvementAreas.push('Address common misconceptions');
            improvementAreas.push('Review related theory');
        }

        return improvementAreas;
    }

    // Generate recommended actions for weak areas
    private static async generateRecommendedActions(student_id: string, topic_id: string): Promise<string[]> {
        try {
            const [weakAreas]: any = await db.query(`
                SELECT q.subtopic as name, COALESCE(sp.mastery_level, 0) as mastery_level
                FROM quizzes q
                LEFT JOIN student_progress sp ON q.subtopic = sp.subtopic_id AND sp.student_id = ?
                WHERE q.topic = ? AND COALESCE(sp.mastery_level, 0) < 70
            `, [student_id, topic_id]);

            const recommendations: string[] = [];

            for (const area of weakAreas) {
                recommendations.push(`Review ${area.name}`);
                recommendations.push(`Take practice quizzes for ${area.name}`);
            }

            return recommendations;
        } catch (error) {
            console.error('Error generating recommended actions:', error);
            return [];
        }
    }

    // Generate learning path with more sophisticated approach
    private static async generateLearningPath(
        student_id: string,
        topicPerformances: StudentCoursePerformance[]
    ): Promise<string[]> {
        const learningPath: string[] = [];

        // Sort topics by performance (ascending) to focus on weak areas first
        const sortedTopics = [...topicPerformances]
            .sort((a, b) => a.average_score - b.average_score);

        for (const topic of sortedTopics) {
            if (topic.average_score < 70) {
                learningPath.push(`Master fundamentals of ${topic.topic_name}`);

                // Add specific subtopic recommendations
                topic.weak_subtopics.forEach(subtopic => {
                    learningPath.push(
                        `Practice ${subtopic.subtopic_name} with focus on: ${subtopic.improvement_areas.length > 0
                            ? subtopic.improvement_areas.join(', ')
                            : 'general improvement'
                        }`
                    );
                });
            }
        }

        return learningPath;
    }

    // Improved misconception tracking with more robust error handling
    static async trackMisconception(
        student_id: string,
        subtopic_id: string,
        misconception_type: string
    ): Promise<void> {
        try {
            // Validate inputs
            if (!student_id || !subtopic_id || !misconception_type) {
                throw new Error('Invalid input parameters');
            }

            const [existing]: any[] = await db.query(`
                SELECT tracking_id, frequency 
                FROM misconception_tracking 
                WHERE student_id = ? AND subtopic_id = ? AND misconception_type = ?
            `, [student_id, subtopic_id, misconception_type]);

            if (existing.length > 0) {
                await db.query(`
                    UPDATE misconception_tracking 
                    SET frequency = frequency + 1, 
                        last_occurrence = CURRENT_TIMESTAMP 
                    WHERE tracking_id = ?
                `, [existing[0].tracking_id]);
            } else {
                await db.query(`
                    INSERT INTO misconception_tracking 
                    (tracking_id, student_id, subtopic_id, misconception_type, last_occurrence) 
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                `, [uuidv4(), student_id, subtopic_id, misconception_type]);
            }
        } catch (error) {
            console.error('Error tracking misconception:', error);
            throw new Error(`Failed to track misconception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Helper methods for identifying areas
    private static identifyWeakAreas(topicPerformances: StudentCoursePerformance[]): string[] {
        return topicPerformances
            .filter(tp => tp.average_score < 70)
            .map(tp => tp.topic_name);
    }

    private static identifyStrongAreas(topicPerformances: StudentCoursePerformance[]): string[] {
        return topicPerformances
            .filter(tp => tp.average_score >= 90)
            .map(tp => tp.topic_name);
    }
}