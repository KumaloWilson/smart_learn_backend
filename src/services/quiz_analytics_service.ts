// // services/analytics_service.ts
// import db from '../config/sql_config';
// import {
//     QuizAnalytics,
//     QuestionAnalytics,
//     StudentPerformance,
//     TopicMasteryAnalytics
// } from '../models/quiz';

// export class AnalyticsService {
//     static async getQuizAnalytics(quiz_id: string): Promise<QuizAnalytics> {
//         const [baseStatsResult] = await db.query(`
//             SELECT 
//                 COUNT(DISTINCT attempt_id) as total_attempts,
//                 AVG(score) as average_score,
//                 AVG(percentage) as completion_rate,
//                 AVG(time_spent) as average_time
//             FROM quiz_attempts
//             WHERE quiz_id = ? AND status = 'completed'
//         `, [quiz_id]);

//         const baseStats = (baseStatsResult as {
//             total_attempts: number,
//             average_score: number,
//             completion_rate: number,
//             average_time: number
//         }[])[0];

//         const [difficultyStats] = await db.query(`
//             SELECT 
//                 q.difficulty,
//                 COUNT(*) as count,
//                 AVG(CASE WHEN qa.is_correct THEN 1 ELSE 0 END) as success_rate
//             FROM questions q
//             LEFT JOIN quiz_answers qa ON q.question_id = qa.question_id
//             WHERE q.quiz_id = ?
//             GROUP BY q.difficulty
//         `, [quiz_id]);

//         const questionAnalytics = await this.getDetailedQuestionAnalytics(quiz_id);
//         const studentPerformance = await this.getStudentPerformanceAnalytics(quiz_id);
//         const topicMastery = await this.getTopicMasteryAnalytics(quiz_id);

//         return {
//             quiz_id,
//             total_attempts: baseStats.total_attempts,
//             average_score: baseStats.average_score,
//             completion_rate: baseStats.completion_rate,
//             average_time: baseStats.average_time,
//             difficulty_distribution: this.formatDifficultyDistribution(difficultyStats),
//             question_performance: questionAnalytics,
//             student_performance: studentPerformance,
//             topic_mastery: topicMastery
//         };
//     }

//     private static async getDetailedQuestionAnalytics(quiz_id: string): Promise<QuestionAnalytics[]> {
//         const [questionsResult] = await db.query(`
//             SELECT 
//                 q.question_id,
//                 q.text,
//                 q.options,
//                 COUNT(DISTINCT qa.answer_id) as total_attempts,
//                 AVG(CASE WHEN qa.is_correct THEN 1 ELSE 0 END) as success_rate,
//                 AVG(qa.time_taken) as average_time,
//                 q.difficulty
//             FROM questions q
//             LEFT JOIN quiz_answers qa ON q.question_id = qa.question_id
//             WHERE q.quiz_id = ?
//             GROUP BY q.question_id
//         `, [quiz_id]);

//         const questions = questionsResult as {
//             question_id: string,
//             text: string,
//             options: string[],
//             total_attempts: number,
//             success_rate: number,
//             average_time: number,
//             difficulty: string
//         }[];

//         const analytics: QuestionAnalytics[] = [];

//         for (const question of questions) {
//             const [optionDistribution] = await db.query(`
//                 SELECT 
//                     selected_answer as option,
//                     COUNT(*) as selection_count
//                 FROM quiz_answers
//                 WHERE question_id = ?
//                 GROUP BY selected_answer
//                 ORDER BY selection_count DESC
//             `, [question.question_id]);

//             const discriminationIndex = await this.calculateDiscriminationIndex(
//                 question.question_id
//             );

//             const difficultyRating = this.calculateDifficultyRating(
//                 question.success_rate,
//                 question.average_time,
//                 question.difficulty
//             );

//             analytics.push({
//                 question_id: question.question_id,
//                 success_rate: question.success_rate,
//                 average_time: question.average_time,
//                 confusion_matrix: optionDistribution as { option: string, selection_count: number }[],
//                 difficulty_rating: difficultyRating,
//                 discrimination_index: discriminationIndex
//             });
//         }

//         return analytics;
//     }

//     private static async calculateDiscriminationIndex(question_id: string): Promise<number> {
//         const [result] = await db.query(`
//             WITH RankedAttempts AS (
//                 SELECT 
//                     qa.attempt_id,
//                     qa.is_correct,
//                     PERCENT_RANK() OVER (ORDER BY qa2.score) as score_rank
//                 FROM quiz_answers qa
//                 JOIN quiz_attempts qa2 ON qa.attempt_id = qa2.attempt_id
//                 WHERE qa.question_id = ?
//             )
//             SELECT 
//                 SUM(CASE WHEN score_rank >= 0.73 AND is_correct THEN 1 ELSE 0 END) as top_correct,
//                 SUM(CASE WHEN score_rank >= 0.73 THEN 1 ELSE 0 END) as top_total,
//                 SUM(CASE WHEN score_rank <= 0.27 AND is_correct THEN 1 ELSE 0 END) as bottom_correct,
//                 SUM(CASE WHEN score_rank <= 0.27 THEN 1 ELSE 0 END) as bottom_total
//             FROM RankedAttempts
//         `, [question_id]);

//         const stats = result[0] as {
//             top_correct: number,
//             top_total: number,
//             bottom_correct: number,
//             bottom_total: number
//         };

//         // Prevent division by zero
//         if (stats.top_total === 0 || stats.bottom_total === 0) {
//             return 0;
//         }

//         const topPerformance = stats.top_correct / stats.top_total;
//         const bottomPerformance = stats.bottom_correct / stats.bottom_total;

//         return topPerformance - bottomPerformance;
//     }

//     private static async getStudentPerformanceAnalytics(quiz_id: string): Promise<StudentPerformance[]> {
//         const [result] = await db.query(`
//             WITH AttemptRanks AS (
//                 SELECT 
//                     student_id,
//                     score,
//                     percentage,
//                     time_spent,
//                     attempt_number,
//                     ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY attempt_number) as attempt_rank,
//                     COUNT(*) OVER (PARTITION BY student_id) as total_attempts
//                 FROM quiz_attempts
//                 WHERE quiz_id = ? AND status = 'completed'
//             ),
//             StudentStats AS (
//                 SELECT 
//                     student_id,
//                     COUNT(*) as attempts,
//                     AVG(percentage) as average_score,
//                     SUM(time_spent) as total_time_spent,
//                     MAX(total_attempts) as max_attempts
//                 FROM AttemptRanks
//                 GROUP BY student_id
//             ),
//             ImprovementStats AS (
//                 SELECT 
//                     ar.student_id,
//                     CASE 
//                         WHEN ar.total_attempts > 1 THEN
//                             ((SELECT percentage 
//                               FROM AttemptRanks ar2 
//                               WHERE ar2.student_id = ar.student_id 
//                               ORDER BY attempt_number DESC 
//                               LIMIT 1) -
//                              (SELECT percentage 
//                               FROM AttemptRanks ar3 
//                               WHERE ar3.student_id = ar.student_id 
//                               ORDER BY attempt_number ASC 
//                               LIMIT 1)) / 
//                             (SELECT percentage 
//                              FROM AttemptRanks ar4 
//                              WHERE ar4.student_id = ar.student_id 
//                              ORDER BY attempt_number ASC 
//                              LIMIT 1) * 100
//                         ELSE 0
//                     END as improvement_trend
//                 FROM AttemptRanks ar
//                 GROUP BY ar.student_id
//             )
//             SELECT 
//                 ss.student_id,
//                 ss.attempts,
//                 ss.average_score,
//                 ist.improvement_trend,
//                 ss.total_time_spent as time_spent,
//                 CASE 
//                     WHEN ss.average_score >= 85 THEN 'advanced'
//                     WHEN ss.average_score >= 70 THEN 'intermediate'
//                     ELSE 'beginner'
//                 END as mastery_level
//             FROM StudentStats ss
//             JOIN ImprovementStats ist ON ss.student_id = ist.student_id
//             ORDER BY ss.average_score DESC
//         `, [quiz_id]);

//         return result as StudentPerformance[];
//     }

//     private static async getTopicMasteryAnalytics(quiz_id: string): Promise<TopicMasteryAnalytics> {
//         // Get quiz topic
//         const [quizResult] = await db.query(
//             'SELECT topic FROM quizzes WHERE quiz_id = ?',
//             [quiz_id]
//         );
//         const quiz = quizResult[0] as { topic: string };

//         // Get mastery distribution
//         const [masteryResult] = await db.query(`
//             SELECT 
//                 COUNT(CASE WHEN percentage >= 85 THEN 1 END) as advanced,
//                 COUNT(CASE WHEN percentage >= 70 AND percentage < 85 THEN 1 END) as intermediate,
//                 COUNT(CASE WHEN percentage < 70 THEN 1 END) as beginner,
//                 AVG(percentage) as class_average
//             FROM quiz_attempts
//             WHERE quiz_id = ? AND status = 'completed'
//         `, [quiz_id]);

//         const masteryStats = masteryResult[0] as {
//             advanced: number,
//             intermediate: number,
//             beginner: number,
//             class_average: number
//         };

//         // Get common misconceptions
//         const misconceptions = await this.identifyCommonMisconceptions(quiz_id);

//         return {
//             topic: quiz.topic,
//             class_average: masteryStats.class_average,
//             mastery_distribution: {
//                 beginner: masteryStats.beginner,
//                 intermediate: masteryStats.intermediate,
//                 advanced: masteryStats.advanced
//             },
//             common_misconceptions: misconceptions
//         };
//     }

//     private static async identifyCommonMisconceptions(quiz_id: string): Promise<string[]> {
//         const [result] = await db.query(`
//             WITH IncorrectAnswers AS (
//                 SELECT 
//                     q.text as question,
//                     q.correct_answer,
//                     qa.selected_answer,
//                     COUNT(*) as frequency,
//                     100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY q.question_id) as error_rate
//                 FROM quiz_answers qa
//                 JOIN questions q ON qa.question_id = q.question_id
//                 WHERE qa.is_correct = false
//                 AND q.quiz_id = ?
//                 GROUP BY q.question_id, q.text, q.correct_answer, qa.selected_answer
//                 HAVING COUNT(*) >= 5
//             )
//             SELECT 
//                 question,
//                 selected_answer,
//                 correct_answer,
//                 frequency,
//                 error_rate
//             FROM IncorrectAnswers
//             WHERE error_rate >= 20  -- Only include significant misconceptions (>20% error rate)
//             ORDER BY error_rate DESC
//             LIMIT 5
//         `, [quiz_id]);

//         const misconceptions = result as {
//             question: string,
//             selected_answer: string,
//             correct_answer: string,
//             frequency: number,
//             error_rate: number
//         }[];

//         return misconceptions.map(m =>
//             `Question: "${m.question}" - ${m.frequency} students (${m.error_rate.toFixed(1)}%) ` +
//             `incorrectly chose "${m.selected_answer}" instead of "${m.correct_answer}"`
//         );
//     }

//     private static calculateDifficultyRating(
//         successRate: number,
//         averageTime: number,
//         intendedDifficulty: string
//     ): number {
//         // Convert averageTime from milliseconds to minutes and cap at 5 minutes
//         const timeInMinutes = Math.min(averageTime / 60000, 5);

//         // Normalize time to a 0-1 scale
//         const normalizedTime = timeInMinutes / 5;

//         // Convert success rate to 0-1 scale (inverted because higher success = lower difficulty)
//         const normalizedSuccess = 1 - (successRate / 100);

//         // Convert intended difficulty to a 0-1 scale
//         const difficultyWeight =
//             intendedDifficulty === 'hard' ? 1 :
//                 intendedDifficulty === 'medium' ? 0.6 :
//                     0.3;

//         // Weighted combination of factors
//         const rawDifficulty = (
//             normalizedSuccess * 0.5 +    // Success rate has highest weight
//             normalizedTime * 0.3 +       // Time taken has medium weight
//             difficultyWeight * 0.2       // Intended difficulty has lowest weight
//         );

//         // Scale to 1-10 range and round to one decimal
//         return Math.round(rawDifficulty * 9 + 1);
//     }

//     private static formatDifficultyDistribution(difficultyStats: any[]): {
//         [key: string]: { count: number; success_rate: number }
//     } {
//         return difficultyStats.reduce((acc, stat) => {
//             acc[stat.difficulty] = {
//                 count: stat.count,
//                 success_rate: stat.success_rate
//             };
//             return acc;
//         }, {} as { [key: string]: { count: number; success_rate: number } });
//     }

//     // Additional utility methods for trend analysis
//     static async getPerformanceTrends(quiz_id: string, timeframe: 'week' | 'month' | 'year'): Promise<any> {
//         const timeframeSQL = {
//             week: 'YEARWEEK(created_at)',
//             month: 'DATE_FORMAT(created_at, "%Y-%m")',
//             year: 'YEAR(created_at)'
//         };

//         const [result] = await db.query(`
//             SELECT 
//                 ${timeframeSQL[timeframe]} as time_period,
//                 COUNT(DISTINCT attempt_id) as attempt_count,
//                 AVG(percentage) as average_score,
//                 AVG(time_spent) as average_time,
//                 COUNT(DISTINCT student_id) as unique_students
//             FROM quiz_attempts
//             WHERE quiz_id = ? 
//             AND status = 'completed'
//             GROUP BY ${timeframeSQL[timeframe]}
//             ORDER BY ${timeframeSQL[timeframe]} ASC
//         `, [quiz_id]);

//         return result;
//     }

//     static async getQuestionEffectiveness(quiz_id: string): Promise<any> {
//         const [result] = await db.query(`
//             WITH QuestionStats AS (
//                 SELECT 
//                     q.question_id,
//                     q.text,
//                     COUNT(DISTINCT qa.answer_id) as attempt_count,
//                     AVG(CASE WHEN qa.is_correct THEN 1 ELSE 0 END) as success_rate,
//                     AVG(qa.time_taken) as avg_time,
//                     AVG(CASE WHEN qa.viewed_hint THEN 1 ELSE 0 END) as hint_usage_rate
//                 FROM questions q
//                 LEFT JOIN quiz_answers qa ON q.question_id = qa.question_id
//                 WHERE q.quiz_id = ?
//                 GROUP BY q.question_id, q.text
//             )
//             SELECT 
//                 *,
//                 CASE 
//                     WHEN success_rate < 0.3 OR success_rate > 0.9 OR 
//                     hint_usage_rate > 0.8 OR
//                     avg_time > 300 THEN 'needs_review'
//                     ELSE 'effective'
//                 END as effectiveness_flag,
//                 CASE
//                     WHEN success_rate < 0.3 THEN 'Too difficult'
//                     WHEN success_rate > 0.9 THEN 'Too easy'
//                     WHEN hint_usage_rate > 0.8 THEN 'High hint dependency'
//                     WHEN avg_time > 300 THEN 'Time consuming'
//                     ELSE 'Optimal'
//                 END as recommendation
//             FROM QuestionStats
//             ORDER BY effectiveness_flag DESC, success_rate ASC
//         `, [quiz_id]);

//         return result;
//     }

//     static async getStudentEngagementMetrics(quiz_id: string): Promise<any> {
//         const [result] = await db.query(`
//             WITH StudentEngagement AS (
//                 SELECT 
//                     student_id,
//                     COUNT(DISTINCT attempt_id) as total_attempts,
//                     AVG(time_spent) as avg_session_time,
//                     MAX(created_at) as last_attempt,
//                     SUM(CASE WHEN status = 'abandoned' THEN 1 ELSE 0 END) as abandoned_attempts,
//                     AVG(CASE 
//                         WHEN status = 'completed' THEN percentage 
//                         ELSE NULL 
//                     END) as avg_score,
//                     COUNT(DISTINCT DATE(created_at)) as unique_days_active
//                 FROM quiz_attempts
//                 WHERE quiz_id = ?
//                 GROUP BY student_id
//             )
//             SELECT 
//                 *,
//                 CASE 
//                     WHEN total_attempts > 3 
//                         AND unique_days_active > 2 
//                         AND abandoned_attempts = 0 THEN 'highly_engaged'
//                     WHEN total_attempts > 1 
//                         AND abandoned_attempts < total_attempts * 0.5 THEN 'moderately_engaged'
//                     ELSE 'low_engagement'
//                 END as engagement_level
//             FROM StudentEngagement
//             ORDER BY unique_days_active DESC, total_attempts DESC
//         `, [quiz_id]);

//         return result;
//     }

//     static async getLearningPathwayAnalysis(quiz_id: string): Promise<any> {
//         const [result] = await db.query(`
//             WITH QuestionSequence AS (
//                 SELECT 
//                     qa.attempt_id,
//                     q.subtopic,
//                     qa.is_correct,
//                     ROW_NUMBER() OVER (PARTITION BY qa.attempt_id ORDER BY qa.created_at) as question_sequence
//                 FROM quiz_answers qa
//                 JOIN questions q ON qa.question_id = q.question_id
//                 WHERE q.quiz_id = ?
//             ),
//             PathwayAnalysis AS (
//                 SELECT 
//                     attempt_id,
//                     STRING_AGG(
//                         CONCAT(subtopic, ':', CASE WHEN is_correct THEN 'correct' ELSE 'incorrect' END),
//                         ' -> ' ORDER BY question_sequence
//                     ) as learning_pathway
//                 FROM QuestionSequence
//                 GROUP BY attempt_id
//             )
//             SELECT 
//                 learning_pathway,
//                 COUNT(*) as frequency,
//                 AVG(CASE WHEN final.is_correct THEN 1 ELSE 0 END) as success_rate
//             FROM PathwayAnalysis pa
//             JOIN QuestionSequence final ON pa.attempt_id = final.attempt_id
//                 AND final.question_sequence = (
//                     SELECT MAX(question_sequence) 
//                     FROM QuestionSequence qs 
//                     WHERE qs.attempt_id = pa.attempt_id
//                 )
//             GROUP BY learning_pathway
//             ORDER BY frequency DESC
//         `, [quiz_id]);

//         return result;
//     }

//     static async generateDetailedReport(quiz_id: string): Promise<{
//         summary: any,
//         questionAnalysis: any,
//         studentAnalysis: any,
//         recommendations: string[]
//     }> {
//         const analytics = await this.getQuizAnalytics(quiz_id);
//         const trends = await this.getPerformanceTrends(quiz_id, 'month');
//         const effectiveness = await this.getQuestionEffectiveness(quiz_id);
//         const engagement = await this.getStudentEngagementMetrics(quiz_id);
//         const pathways = await this.getLearningPathwayAnalysis(quiz_id);

//         const recommendations: string[] = [];

//         // Analyze completion rate
//         if (analytics.completion_rate < 70) {
//             recommendations.push(
//                 'Low completion rate detected. Consider: ' +
//                 '1. Reviewing quiz length and time limit ' +
//                 '2. Adding more scaffolding for difficult questions ' +
//                 '3. Including more practice questions before assessment'
//             );
//         }

//         // Analyze question effectiveness
//         const problematicQuestions = effectiveness.filter(
//             (q: any) => q.effectiveness_flag === 'needs_review'
//         );
//         if (problematicQuestions.length > 0) {
//             recommendations.push(
//                 `${problematicQuestions.length} questions need review. Common issues: ` +
//                 problematicQuestions.map((q: any) => q.recommendation).join(', ')
//             );
//         }

//         // Analyze student engagement
//         const lowEngagement = engagement.filter(
//             (s: any) => s.engagement_level === 'low_engagement'
//         ).length;
//         if (lowEngagement > 0) {
//             recommendations.push(
//                 `${lowEngagement} students show low engagement. Consider: ` +
//                 '1. Adding more interactive elements ' +
//                 '2. Implementing progress tracking features ' +
//                 '3. Introducing achievement badges'
//             );
//         }

//         // Identify most successful learning pathways
//         const successfulPathways = pathways
//             .filter((p: any) => p.success_rate > 0.8)
//             .slice(0, 3);
//         if (successfulPathways.length > 0) {
//             recommendations.push(
//                 'Most successful learning pathways identified: ' +
//                 successfulPathways.map((p: any) =>
//                     `Path (${p.frequency} students, ${(p.success_rate * 100).toFixed(1)}% success): ${p.learning_pathway}`
//                 ).join('; ')
//             );
//         }

//         return {
//             summary: {
//                 ...analytics,
//                 trends
//             },
//             questionAnalysis: effectiveness,
//             studentAnalysis: {
//                 engagement,
//                 pathways
//             },
//             recommendations
//         };
//     }
// }