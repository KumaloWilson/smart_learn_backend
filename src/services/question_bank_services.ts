import { Question } from '../models/quiz_question';
import db from '../config/sql_config';
import { ResultSetHeader, } from 'mysql2/promise';

export class QuestionBankService {
    /**
     * Saves multiple questions to the database in a single transaction
     * @param questions Array of Question objects to save
     * @returns Promise<Question[]> Array of successfully saved questions
     * @throws Error if the save operation fails
     */
    static async saveQuestions(questions: Question[]): Promise<Question[]> {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const savedQuestions: Question[] = [];

            for (const question of questions) {
                const sql = `
                    INSERT INTO questions (
                        attempt_id,
                        question_id,
                        text,
                        options,
                        correct_answer,
                        explanation,
                        difficulty,
                        misconception,
                        points,
                        type
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const values = [
                    question.attempt_id,
                    question.question_id,
                    question.text,
                    JSON.stringify(question.options),
                    question.correct_answer,
                    question.explanation || null,
                    question.difficulty,
                    question.misconception || null,
                    question.points,
                    question.type
                ];

                const [result] = await connection.execute<ResultSetHeader>(sql, values);

                if (result.affectedRows === 1) {
                    savedQuestions.push(question);
                }
            }

            await connection.commit();
            return savedQuestions;

        } catch (error) {
            await connection.rollback();
            console.error("Error saving questions:", error);
            throw new Error(`Failed to save questions: ${error instanceof Error ? error.message : 'Unknown error'}`);

        } finally {
            connection.release();
        }
    }
}