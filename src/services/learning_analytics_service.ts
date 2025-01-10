import db from '../config/sql_config';
import { QuestionResponse } from '../models/quiz_question_response';
import { StudentAnalytics, } from '../models/student_analytics';

import { SubtopicPerformance } from '../models/student_sub_topic_perfomance';

import { TopicPerformance } from '../models/student_topic_perfomance';

import { v4 as uuidv4 } from 'uuid';

export class LearningAnalyticsService {
    static async getStudentAnalytics(student_id: string): Promise<StudentAnalytics> {
        // Get overall progress
        const [progressRows]: any = await db.query(`
            SELECT AVG(mastery_level) as overall_progress
            FROM student_progress
            WHERE student_id = ?
        `, [student_id]);

        // Get topic performances
        const topicPerformances = await this.getTopicPerformances(student_id);

        // Identify weak and strong areas
        const weakAreas = topicPerformances
            .filter(tp => tp.average_score < 70)
            .map(tp => tp.topic_name);

        const strongAreas = topicPerformances
            .filter(tp => tp.average_score >= 90)
            .map(tp => tp.topic_name);

        // Generate personalized learning path
        const learningPath = await this.generateLearningPath(student_id, topicPerformances);

        return {
            student_id,
            overall_progress: progressRows[0].overall_progress,
            topic_performances: topicPerformances,
            learning_path: learningPath,
            weak_areas: weakAreas,
            strong_areas: strongAreas
        };
    }

    private static async getTopicPerformances(student_id: string): Promise<TopicPerformance[]> {
        const [rows]: any = await db.query(`
            SELECT 
                t.topic_id,
                t.name as topic_name,
                AVG(qa.score) as average_score,
                COUNT(DISTINCT qa.quiz_id) / COUNT(DISTINCT q.quiz_id) as completion_rate
            FROM topics t
            JOIN subtopics s ON t.topic_id = s.topic_id
            JOIN quizzes q ON s.subtopic_id = q.subtopic_id
            LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id AND qa.student_id = ?
            GROUP BY t.topic_id, t.name
        `, [student_id]);

        const topicPerformances: TopicPerformance[] = [];

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
    }

    private static async getSubtopicPerformances(student_id: string, topic_id: string): Promise<SubtopicPerformance[]> {
        const [rows]: any = await db.query(`
            SELECT 
                s.subtopic_id,
                s.name as subtopic_name,
                sp.mastery_level,
                sp.attempts_count,
                mt.misconception_type
            FROM subtopics s
            LEFT JOIN student_progress sp ON s.subtopic_id = sp.subtopic_id AND sp.student_id = ?
            LEFT JOIN misconception_tracking mt ON s.subtopic_id = mt.subtopic_id AND mt.student_id = ?
            WHERE s.topic_id = ?
        `, [student_id, student_id, topic_id]);

        // Group by subtopic and aggregate data
        const subtopicMap = new Map<string, SubtopicPerformance>();

        rows.forEach((row: { subtopic_id: string; subtopic_name: any; mastery_level: any; attempts_count: any; misconception_type: string; }) => {
            if (!subtopicMap.has(row.subtopic_id)) {
                subtopicMap.set(row.subtopic_id, {
                    subtopic_id: row.subtopic_id,
                    subtopic_name: row.subtopic_name,
                    mastery_level: row.mastery_level || 0,
                    attempts_count: row.attempts_count || 0,
                    common_misconceptions: [],
                    improvement_areas: []
                });
            }

            if (row.misconception_type) {
                subtopicMap.get(row.subtopic_id)!.common_misconceptions.push(row.misconception_type);
            }
        });

        // Generate improvement areas based on misconceptions and mastery level
        for (const subtopic of subtopicMap.values()) {
            subtopic.improvement_areas = await this.generateImprovementAreas(subtopic);
        }

        return Array.from(subtopicMap.values());
    }

    private static async generateImprovementAreas(subtopic: SubtopicPerformance): Promise<string[]> {
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

    private static async generateRecommendedActions(student_id: string, topic_id: string): Promise<string[]> {
        // Get weak areas and generate specific recommendations
        const [weakAreas]: any = await db.query(`
            SELECT s.name, sp.mastery_level
            FROM subtopics s
            JOIN student_progress sp ON s.subtopic_id = sp.subtopic_id
            WHERE sp.student_id = ? AND s.topic_id = ? AND sp.mastery_level < 70
        `, [student_id, topic_id]);

        const recommendations: string[] = [];

        for (const area of weakAreas) {
            recommendations.push(`Review ${area.name}`);
            recommendations.push(`Take practice quizzes for ${area.name}`);
        }

        return recommendations;
    }

    private static async generateLearningPath(
        student_id: string,
        topicPerformances: TopicPerformance[]
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
                    learningPath.push(`Practice ${subtopic.subtopic_name} with focus on: ${subtopic.improvement_areas.join(', ')}`);
                });
            }
        }

        return learningPath;
    }

    static async trackMisconception(
        student_id: string,
        subtopic_id: string,
        misconception_type: string
    ): Promise<void> {
        const [existing]: any[] = await db.query(`
            SELECT tracking_id, frequency 
            FROM misconception_tracking 
            WHERE student_id = ? AND subtopic_id = ? AND misconception_type = ?
        `, [student_id, subtopic_id, misconception_type]);

        if (existing.length > 0) {
            await db.query(`
                UPDATE misconception_tracking 
                SET frequency = frequency + 1, last_occurrence = CURRENT_TIMESTAMP 
                WHERE tracking_id = ?
            `, [existing[0].tracking_id]);
        } else {
            await db.query(`
                INSERT INTO misconception_tracking 
                (tracking_id, student_id, subtopic_id, misconception_type) 
                VALUES (?, ?, ?, ?)
            `, [uuidv4(), student_id, subtopic_id, misconception_type]);
        }
    }
}

// services/quiz_session_service.ts
export class QuizSessionService {
    static async startQuizAttempt(student_id: string, quiz_id: string): Promise<string> {
        // Check attempt limits
        const [attempts]: any = (await db.query(`
            SELECT COUNT(*) as count 
            FROM quiz_attempts 
            WHERE student_id = ? AND quiz_id = ?
        `, [student_id, quiz_id]))[0];

        const [quizInfo]: any = await db.query(`
            SELECT max_attempts 
            FROM quizzes 
            WHERE quiz_id = ?
        `, [quiz_id]);

        if (attempts[0].count >= quizInfo[0].max_attempts) {
            throw new Error('Maximum attempts reached for this quiz');
        }

        const attempt_id = uuidv4();
        await db.query(`
            INSERT INTO quiz_attempts 
            (attempt_id, student_id, quiz_id, start_time, status) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'in_progress')
        `, [attempt_id, student_id, quiz_id]);

        return attempt_id;
    }

    static async submitQuizAttempt(attempt_id: string, responses: QuestionResponse[]): Promise<number> {
        // Calculate score and update attempt
        let totalPoints = 0;
        let earnedPoints = 0;

        for (const response of responses) {
            const [questionInfo]: any = await db.query(`
                SELECT points, correct_answer 
                FROM questions 
                WHERE question_id = ?
            `, [response.question_id]);

            totalPoints += questionInfo[0].points;
            if (response.student_answer === questionInfo[0].correct_answer) {
                earnedPoints += questionInfo[0].points;
            }

            // Track response
            await db.query(`
                INSERT INTO question_responses 
                (response_id, attempt_id, question_id, student_answer, is_correct, time_taken) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                uuidv4(),
                attempt_id,
                response.question_id,
                response.student_answer,
                response.student_answer === questionInfo[0].correct_answer,
                response.time_taken
            ]);
        }

        const score = (earnedPoints / totalPoints) * 100;

        // Update attempt status and score
        await db.query(`
            UPDATE quiz_attempts 
            SET status = 'completed', score = ?, end_time = CURRENT_TIMESTAMP 
            WHERE attempt_id = ?
        `, [score, attempt_id]);

        // Update student progress
        await this.updateStudentProgress(attempt_id, score);

        return score;
    }

    private static async updateStudentProgress(attempt_id: string, score: number): Promise<void> {
        const [attemptInfo]: any = await db.query(`
            SELECT qa.student_id, q.subtopic_id 
            FROM quiz_attempts qa 
            JOIN quizzes q ON qa.quiz_id = q.quiz_id 
            WHERE qa.attempt_id = ?
        `, [attempt_id]);

        const { student_id, subtopic_id } = attemptInfo[0];

        // Update or create progress record
        const [existing]: any = await db.query(`
            SELECT progress_id, mastery_level, attempts_count 
            FROM student_progress 
            WHERE student_id = ? AND subtopic_id = ?
        `, [student_id, subtopic_id]);

        if (existing.length > 0) {
            // Calculate new mastery level (weighted average)
            const newMasteryLevel = (
                existing[0].mastery_level * existing[0].attempts_count + score
            ) / (existing[0].attempts_count + 1);

            await db.query(`
                UPDATE student_progress 
                SET mastery_level = ?, 
                    attempts_count = attempts_count + 1,
                    last_attempt_date = CURRENT_TIMESTAMP 
                WHERE progress_id = ?
            `, [newMasteryLevel, existing[0].progress_id]);
        } else {
            await db.query(`
                INSERT INTO student_progress 
                (progress_id, student_id, subtopic_id, mastery_level, attempts_count) 
                VALUES (?, ?, ?, ?, 1)
            `, [uuidv4(), student_id, subtopic_id, score]);
        }
    }
}
