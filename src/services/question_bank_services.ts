import { Question } from '../models/quiz_question';
import db from '../config/sql_config';
import { ResultSetHeader } from 'mysql2';

export class QuestionBankService {

    static async saveQuestions(questions: Question[]): Promise<Question[]> {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const savedQuestions: Question[] = [];

            for (const question of questions) {
                const sql = `
                    INSERT INTO question_bank (
                        question_id, quiz_id, course_id, text, options, correct_answer,
                        explanation, difficulty, topic, subtopic, points,
                        time_estimate, hint, misconception, tags, type,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const values = [
                    question.question_id,
                    question.text,
                    JSON.stringify(question.options),
                    question.correct_answer,
                    question.explanation,
                    question.difficulty,
                    question.topic,
                    question.subtopic,
                    question.points,
                    question.time_estimate,
                    question.hint,
                    question.misconception,
                    JSON.stringify(question.tags),
                    question.type,
                    question.created_at,
                    question.updated_at
                ];

                const [result] = await connection.execute<ResultSetHeader>(sql, values);

                if (result.affectedRows === 1) {
                    savedQuestions.push(question);
                }
            }

            await connection.commit();
            return savedQuestions;

        } catch (error: any) {
            await connection.rollback();
            console.error("Error saving questions:", error);
            throw new Error(`Failed to save questions: ${error.message}`);
        } finally {
            connection.release();
        }
    }
}