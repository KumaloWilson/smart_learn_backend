// services/quiz_session_service.ts
import db from '../config/sql_config';
import { v4 as uuidv4 } from 'uuid';
import { QuestionResponse } from '../models/quiz_question_response';
import { LearningAnalyticsService } from './learning_analytics_service';


export class QuizSessionService {
    static async startQuizAttempt(student_id: string, quiz_id: string): Promise<QuizSession> {
        // Validate quiz availability and attempt limits
        const [quizInfo]: any = await db.query(`
            SELECT q.*, COUNT(qa.attempt_id) as attempt_count
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id 
                AND qa.student_id = ?
                AND qa.status = 'completed'
            WHERE q.quiz_id = ?
            GROUP BY q.quiz_id
        `, [student_id, quiz_id]);

        if (!quizInfo.length) {
            throw new Error('Quiz not found');
        }

        if (quizInfo[0].attempt_count >= quizInfo[0].max_attempts) {
            throw new Error('Maximum attempts reached for this quiz');
        }

        // Create new attempt
        const attempt_id = uuidv4();
        const session: QuizSession = {
            attempt_id,
            quiz_id,
            student_id,
            start_time: new Date(),
            current_question_index: 0,
            remaining_time: quizInfo[0].time_limit * 60, // Convert minutes to seconds
            status: 'in_progress'
        };

        await db.query(`
            INSERT INTO quiz_attempts (
                attempt_id, student_id, quiz_id, start_time, status
            ) VALUES (?, ?, ?, ?, ?)
        `, [attempt_id, student_id, quiz_id, session.start_time, session.status]);

        return session;
    }

    static async getQuizAttempt(attempt_id: string): Promise<QuizSession> {
        const [attempt]: any = await db.query(`
            SELECT qa.*, q.time_limit
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.quiz_id
            WHERE qa.attempt_id = ?
        `, [attempt_id]);

        if (!attempt.length) {
            throw new Error('Quiz attempt not found');
        }

        // Calculate remaining time
        const elapsedTime = Math.floor((Date.now() - new Date(attempt[0].start_time).getTime()) / 1000);
        const remainingTime = Math.max(0, attempt[0].time_limit * 60 - elapsedTime);

        return {
            attempt_id: attempt[0].attempt_id,
            quiz_id: attempt[0].quiz_id,
            student_id: attempt[0].student_id,
            start_time: attempt[0].start_time,
            end_time: attempt[0].end_time,
            current_question_index: attempt[0].current_question_index || 0,
            remaining_time: remainingTime,
            status: attempt[0].status,
            score: attempt[0].score
        };
    }

    static async submitQuizAttempt(attempt_id: string, responses: QuestionResponse[]): Promise<number> {
        // Validate attempt exists and is in progress
        const session = await this.getQuizAttempt(attempt_id);
        if (session.status !== 'in_progress') {
            throw new Error('Quiz attempt is not in progress');
        }

        if (session.remaining_time <= 0) {
            throw new Error('Quiz time has expired');
        }

        // Calculate score and process responses
        let totalPoints = 0;
        let earnedPoints = 0;
        const misconceptions: { subtopic_id: string, type: string }[] = [];

        for (const response of responses) {
            const [questionInfo]: any = await db.query(`
                SELECT q.*, s.subtopic_id
                FROM questions q
                JOIN quizzes qz ON q.quiz_id = qz.quiz_id
                JOIN subtopics s ON qz.subtopic_id = s.subtopic_id
                WHERE q.question_id = ?
            `, [response.question_id]);

            totalPoints += questionInfo[0].points;
            const isCorrect = response.student_answer === questionInfo[0].correct_answer;

            if (isCorrect) {
                earnedPoints += questionInfo[0].points;
            } else if (questionInfo[0].misconception) {
                misconceptions.push({
                    subtopic_id: questionInfo[0].subtopic_id,
                    type: questionInfo[0].misconception
                });
            }

            // Record response
            await db.query(`
                INSERT INTO question_responses (
                    response_id,
                    attempt_id,
                    question_id,
                    student_answer,
                    is_correct,
                    time_taken
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
                uuidv4(),
                attempt_id,
                response.question_id,
                response.student_answer,
                isCorrect,
                response.time_taken
            ]);
        }

        const score = (earnedPoints / totalPoints) * 100;

        // Update attempt
        await db.query(`
            UPDATE quiz_attempts 
            SET 
                status = 'completed',
                score = ?,
                end_time = CURRENT_TIMESTAMP
            WHERE attempt_id = ?
        `, [score, attempt_id]);

        // Track misconceptions
        for (const misconception of misconceptions) {
            await LearningAnalyticsService.trackMisconception(
                session.student_id,
                misconception.subtopic_id,
                misconception.type
            );
        }

        // Update student progress
        await this.updateStudentProgress(session.student_id, session.quiz_id, score);

        return score;
    }

    static async updateStudentProgress(
        student_id: string,
        quiz_id: string,
        score: number
    ): Promise<void> {
        const [quizInfo]: any = await db.query(`
            SELECT subtopic_id
            FROM quizzes
            WHERE quiz_id = ?
        `, [quiz_id]);

        // Get existing progress
        const [progress]: any = await db.query(`
            SELECT *
            FROM student_progress
            WHERE student_id = ? AND subtopic_id = ?
        `, [student_id, quizInfo[0].subtopic_id]);

        if (progress.length > 0) {
            // Update existing progress
            const newMasteryLevel = this.calculateNewMasteryLevel(
                progress[0].mastery_level,
                score,
                progress[0].attempts_count
            );

            await db.query(`
                UPDATE student_progress
                SET 
                    mastery_level = ?,
                    attempts_count = attempts_count + 1,
                    last_attempt_date = CURRENT_TIMESTAMP
                WHERE student_id = ? AND subtopic_id = ?
            `, [newMasteryLevel, student_id, quizInfo[0].subtopic_id]);
        } else {
            // Create new progress entry
            await db.query(`
                INSERT INTO student_progress (
                    progress_id,
                    student_id,
                    subtopic_id,
                    mastery_level,
                    attempts_count,
                    last_attempt_date
                ) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
            `, [uuidv4(), student_id, quizInfo[0].subtopic_id, score]);
        }
    }

    static async abandonQuizAttempt(attempt_id: string): Promise<void> {
        const session = await this.getQuizAttempt(attempt_id);
        if (session.status !== 'in_progress') {
            throw new Error('Quiz attempt is not in progress');
        }

        await db.query(`
            UPDATE quiz_attempts
            SET 
                status = 'abandoned',
                end_time = CURRENT_TIMESTAMP
            WHERE attempt_id = ?
        `, [attempt_id]);
    }

    static async getQuizHistory(student_id: string, quiz_id?: string): Promise<any[]> {
        let query = `
            SELECT 
                qa.*,
                q.title as quiz_title,
                q.subtopic_id,
                s.name as subtopic_name,
                t.name as topic_name
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.quiz_id
            JOIN subtopics s ON q.subtopic_id = s.subtopic_id
            JOIN topics t ON s.topic_id = t.topic_id
            WHERE qa.student_id = ?
        `;
        const params = [student_id];

        if (quiz_id) {
            query += ' AND qa.quiz_id = ?';
            params.push(quiz_id);
        }

        query += ' ORDER BY qa.start_time DESC';

        const [attempts]: any = await db.query(query, params);
        return attempts;
    }

    private static calculateNewMasteryLevel(
        currentMastery: number,
        newScore: number,
        attemptCount: number
    ): number {
        // Weighted average favoring recent attempts
        const weightPrevious = Math.max(0.3, 1 - 1 / (attemptCount + 1));
        const weightNew = 1 - weightPrevious;
        return (currentMastery * weightPrevious + newScore * weightNew);
    }
}