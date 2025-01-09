// services/quiz_attempt_service.ts
import db from '../config/sql_config';
import { QuizAnswer } from '../models/quiz_answer';
import { QuizAttempt, } from '../models/quiz_attempt';
import { v4 as uuidv4 } from 'uuid';

export class QuizAttemptService {
    static async startAttempt(quiz_id: string, student_id: string): Promise<string> {
        const attempt_id = uuidv4();

        try {
            const [quiz] = await db.query(
                'SELECT total_questions, time_limit FROM quizzes WHERE quiz_id = ?',
                [quiz_id]
            );

            if (!quiz) throw new Error('Quiz not found');

            const [{ max_score }] = await db.query(
                'SELECT SUM(points) as max_score FROM questions WHERE quiz_id = ?',
                [quiz_id]
            );

            await db.query(
                `INSERT INTO quiz_attempts SET ?`,
                [{
                    attempt_id,
                    quiz_id,
                    student_id,
                    score: 0,
                    max_possible_score: max_score,
                    percentage: 0,
                    start_time: new Date(),
                    status: 'in_progress',
                    time_spent: 0
                }]
            );

            return attempt_id;
        } catch (error) {
            throw new Error(`Failed to start quiz attempt: ${error}`);
        }
    }

    static async submitAnswer(answer: Partial<QuizAnswer>): Promise<{
        is_correct: boolean;
        points_earned: number;
        explanation: string;
        feedback?: string;
    }> {
        try {
            await db.transaction(async (connection) => {
                // Validate attempt status
                const [attempt] = await connection.query(
                    'SELECT status, time_limit FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.quiz_id WHERE attempt_id = ?',
                    [answer.attempt_id]
                );

                if (attempt.status !== 'in_progress') {
                    throw new Error('Quiz attempt is no longer active');
                }

                // Check time limit
                if (attempt.time_limit && (answer.time_taken ?? 0) > attempt.time_limit) {
                    throw new Error('Time limit exceeded');
                }

                const [question] = await connection.query(
                    'SELECT correct_answer, points, explanation FROM questions WHERE question_id = ?',
                    [answer.question_id]
                );

                const is_correct = answer.selected_answer === question.correct_answer;
                const points_earned = is_correct ? question.points : 0;

                await connection.query(
                    `INSERT INTO quiz_answers SET ?`,
                    [{
                        answer_id: uuidv4(),
                        ...answer,
                        is_correct,
                        points_earned
                    }]
                );

                await connection.query(
                    `UPDATE quiz_attempts 
                    SET score = score + ?,
                        percentage = (score + ?) / max_possible_score * 100,
                        time_spent = time_spent + ?
                    WHERE attempt_id = ?`,
                    [points_earned, points_earned, answer.time_taken, answer.attempt_id]
                );

                return {
                    is_correct,
                    points_earned,
                    explanation: question.explanation
                };
            });
        } catch (error) {
            throw new Error(`Failed to submit answer: ${error}`);
        }
    }

    static async completeAttempt(attempt_id: string): Promise<QuizAttempt> {
        try {
            await db.query(
                `UPDATE quiz_attempts 
                SET status = 'completed',
                    end_time = NOW()
                WHERE attempt_id = ? AND status = 'in_progress'`,
                [attempt_id]
            );

            return this.getAttemptSummary(attempt_id);
        } catch (error) {
            throw new Error(`Failed to complete attempt: ${error}`);
        }
    }

    static async getAttemptSummary(attempt_id: string): Promise<QuizAttempt> {
        try {
            const [[attempt], [answers]] = await Promise.all([
                db.query('SELECT * FROM quiz_attempts WHERE attempt_id = ?', [attempt_id]),
                db.query(`
                    SELECT qa.*, q.text, q.explanation
                    FROM quiz_answers qa
                    JOIN questions q ON qa.question_id = q.question_id
                    WHERE qa.attempt_id = ?
                `, [attempt_id])
            ]);

            if (!attempt) throw new Error('Attempt not found');

            return {
                ...attempt,
                answers
            };
        } catch (error) {
            throw new Error(`Failed to get attempt summary: ${error}`);
        }
    }
}