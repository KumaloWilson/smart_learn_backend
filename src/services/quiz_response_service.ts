import { v4 as uuidv4 } from 'uuid';
import db from '../config/sql_config';
import { QuestionResponse } from '../models/quiz_question_response';
import {QuizResult} from "../models/quiz_result";


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
    static async getAttemptResponses(attempt_id: string): Promise<QuizResult> {
        // Fetch responses for the given attempt
        const [responses]: any = await db.query(`
        SELECT 
            r.question_id,
            q.text,
            r.student_answer,
            q.correct_answer,
            r.is_correct,
            r.points_earned,
            r.time_taken
        FROM question_responses r
        JOIN questions q ON r.question_id = q.question_id
        WHERE r.attempt_id = ?
        ORDER BY r.created_at ASC
    `, [attempt_id]);

        // Fetch overall statistics for the attempt
        const [statistics]: any = await db.query(`
        SELECT 
            COUNT(r.response_id) AS total_questions,
            SUM(r.is_correct) AS correct_answers,
            AVG(r.time_taken) AS avg_time_per_question,
            a.score AS score
        FROM question_responses r
        JOIN quiz_attempts a ON r.attempt_id = a.attempt_id
        WHERE r.attempt_id = ?
    `, [attempt_id]);

        // Construct the final response structure
        return {
            score: statistics[0].score || 0,
            statistics: {
                total_questions: statistics[0].total_questions || 0,
                correct_answers: statistics[0].correct_answers || 0,
                avg_time_per_question: Math.round(statistics[0].avg_time_per_question || 0),
            },
            responses: responses.map((response: any) => ({
                question_id: response.question_id,
                text: response.text,
                student_answer: response.student_answer,
                correct_answer: response.correct_answer,
                is_correct: !!response.is_correct,
                points_earned: response.points_earned || 0,
            })),
        };
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
