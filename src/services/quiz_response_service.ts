import { v4 as uuidv4 } from 'uuid';
import db from '../config/sql_config';
import { QuestionResponse } from '../models/quiz_question_response';

export class QuizResponseService {
    // Submit a single question response
    static async submitQuestionResponse(data: {
        attempt_id: string;
        question_id: string;
        student_answer: string;
        time_taken?: number;
    }): Promise<QuestionResponse> {
        // Validate attempt is still in progress
        const [attemptStatus]: any = await db.query(
            'SELECT status FROM quiz_attempts WHERE attempt_id = ?',
            [data.attempt_id]
        );

        if (!attemptStatus || attemptStatus.status !== 'in_progress') {
            throw new Error('Invalid or completed quiz attempt');
        }

        // Get question details to validate answer
        const [question]: any = await db.query(
            'SELECT correct_answer, points FROM questions WHERE question_id = ?',
            [data.question_id]
        );

        const is_correct = question.correct_answer === data.student_answer;
        const points_earned = is_correct ? question.points : 0;

        const response: QuestionResponse = {
            response_id: uuidv4(),
            attempt_id: data.attempt_id,
            question_id: data.question_id,
            student_answer: data.student_answer,
            is_correct,
            time_taken: data.time_taken,
            created_at: new Date(),
            points_earned,
            feedback: is_correct ? 'Correct!' : 'Incorrect. Review the explanation for more details.'
        };

        await db.query(`
            INSERT INTO question_responses (
                response_id,
                attempt_id,
                question_id,
                student_answer,
                is_correct,
                time_taken,
                points_earned,
                feedback,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            response.response_id,
            response.attempt_id,
            response.question_id,
            response.student_answer,
            response.is_correct,
            response.time_taken,
            response.points_earned,
            response.feedback,
            response.created_at
        ]);

        return response;
    }

    // Get all responses for a quiz attempt
    static async getAttemptResponses(attempt_id: string): Promise<QuestionResponse[]> {
        const [responses]: any = await db.query(`
            SELECT 
                r.*,
                q.correct_answer,
                q.explanation
            FROM question_responses r
            JOIN questions q ON r.question_id = q.question_id
            WHERE r.attempt_id = ?
            ORDER BY r.created_at ASC
        `, [attempt_id]);

        return responses;
    }

    // Calculate attempt statistics
    static async calculateAttemptStatistics(attempt_id: string) {
        const [stats]: any = await db.query(`
            SELECT 
                COUNT(*) as total_questions,
                SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
                SUM(points_earned) as total_points,
                AVG(time_taken) as avg_time_per_question
            FROM question_responses
            WHERE attempt_id = ?
        `, [attempt_id]);

        return stats[0];
    }
}
