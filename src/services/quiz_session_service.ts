import db from '../config/sql_config';
import { v4 as uuidv4 } from 'uuid';
import { QuizSession } from '../models/quiz_session';
import { QuestionResponse } from '../models/quiz_question_response';
import { LearningAnalyticsService } from './learning_analytics_service';
import { Quiz } from '../models/quiz';
import { QuestionGenerationService } from './quiz_generation_service';
import { Question } from '../models/quiz_question';


export class QuizSessionService {

    static async startQuizAttempt(student_id: string, quiz: Quiz): Promise<{ quizSession: QuizSession, questions: Question[] }> {

        const attempt_id = uuidv4();

        const questions = await QuestionGenerationService.generateQuestions(
            attempt_id,
            quiz.topic,
            quiz.difficulty,
            quiz.total_questions,
            {
                subtopic: quiz.subtopic,
                learningObjectives: quiz.learning_objectives,
            }
        );
        // Validate quiz availability and attempt limits
        const [quizInfo]: any = await db.query(`
            SELECT q.*, COUNT(qa.attempt_id) as attempt_count
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id 
                AND qa.student_id = ?
                AND qa.status = 'completed'
            WHERE q.quiz_id = ?
            GROUP BY q.quiz_id
        `, [student_id, quiz.quiz_id]);

        if (!quizInfo.length) {
            throw new Error('Quiz not found');
        }

        if (quizInfo[0].attempt_count >= quizInfo[0].max_attempts) {
            throw new Error('Maximum attempts reached for this quiz');
        }

        // Create new attempt
        const session: QuizSession = {
            attempt_id,
            quiz_id: quiz.quiz_id,
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
        `, [attempt_id, student_id, quiz.quiz_id, session.start_time, session.status]);

        return {
            quizSession: session,
            questions: questions
        };
    }

    static async submitQuizAttempt(attempt_id: string, responses: QuestionResponse[]): Promise<{ score: number, detailedResponses: QuestionResponse[] }> {
        try {
            // Input validation
            if (!attempt_id || typeof attempt_id !== 'string') {
                throw new ValidationError('Invalid attempt_id provided');
            }

            if (!Array.isArray(responses) || responses.length === 0) {
                throw new ValidationError('Responses must be a non-empty array');
            }

            // Validate each response object
            responses.forEach((response, index) => {
                if (!response.question_id || !response.student_answer || typeof response.time_taken !== 'number') {
                    throw new ValidationError(`Invalid response data at index ${index}`);
                }
                if (response.time_taken < 0) {
                    throw new ValidationError(`Invalid time_taken value at index ${index}`);
                }
            });

            // Validate attempt exists and is in progress
            const session = await this.getQuizAttempt(attempt_id).catch((error) => {
                throw new DatabaseError(`Failed to fetch quiz attempt: ${error.message}`);
            });

            if (!session) {
                throw new QuizAttemptError('Quiz attempt not found');
            }

            if (session.status !== 'in_progress') {
                throw new QuizAttemptError('Quiz attempt is not in progress');
            }

            // Initialize variables
            let totalPoints = 0;
            let earnedPoints = 0;
            const detailedResponses: QuestionResponse[] = [];
            const misconceptions: { subtopic: string, type: string }[] = [];

            // Process each response
            for (const response of responses) {
                try {
                    // Fetch question info with error handling
                    const [questionInfo]: any = await db.query(`
                    SELECT q.*, qz.subtopic
                    FROM questions q
                    JOIN quiz_attempts qa ON qa.attempt_id = q.attempt_id
                    JOIN quizzes qz ON qa.quiz_id = qz.quiz_id
                    WHERE q.question_id = ?
                `, [response.question_id]).catch((error) => {
                        throw new DatabaseError(`Failed to fetch question info: ${error.message}`);
                    });

                    if (!questionInfo || questionInfo.length === 0) {
                        throw new ValidationError(`Question not found: ${response.question_id}`);
                    }

                    // Before destructuring, log the full questionInfo
                    console.log('Full questionInfo:', questionInfo);

                    // Modify how we access the data
                    const questionData = Array.isArray(questionInfo) ? questionInfo[0] : questionInfo;
                    console.log('Question data:', questionData);

                    const points = Number(questionData.points);
                    console.log('Points after conversion:', points);

                    if (isNaN(points) || points < 0) {
                        throw new ValidationError(`Invalid points value for question: ${response.question_id}`);
                    }


                    totalPoints += points;

                    const isCorrect = response.student_answer === questionInfo.correct_answer;
                    let feedback = "Incorrect answer.";

                    if (isCorrect) {
                        earnedPoints += points;
                        feedback = "Correct answer!";
                    } else if (questionInfo.misconception) {
                        misconceptions.push({
                            subtopic: questionInfo.subtopic,
                            type: questionInfo.misconception
                        });
                        feedback += ` Common misconception: ${questionInfo.misconception}.`;
                    }

                    // Create detailed response
                    const detailedResponse: QuestionResponse = {
                        response_id: uuidv4(),
                        attempt_id,
                        question_id: response.question_id,
                        student_answer: response.student_answer,
                        is_correct: response.is_correct,
                        time_taken: response.time_taken,
                        points_earned: response.points_earned,
                        feedback,
                    };

                    detailedResponses.push(detailedResponse);

                    // Insert response with error handling
                    await db.query(`
                    INSERT INTO question_responses (
                        response_id,
                        attempt_id,
                        question_id,
                        student_answer,
                        is_correct,
                        time_taken,
                        points_earned,
                        feedback
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                        detailedResponse.response_id,
                        attempt_id,
                        response.question_id,
                        response.student_answer,
                        isCorrect,
                        response.time_taken,
                        detailedResponse.points_earned,
                        feedback
                    ]).catch((error) => {
                        throw new DatabaseError(`Failed to insert question response: ${error.message}`);
                    });
                } catch (error) {
                    // Roll back any inserted responses if possible
                    await this.rollbackResponses(attempt_id, detailedResponses.map(r => r.response_id!))
                        .catch(rollbackError => console.error('Rollback failed:', rollbackError));
                    throw error;
                }
            }

            if (totalPoints === 0) {
                throw new ValidationError('No valid points found for quiz questions');
            }

            const score = (earnedPoints / totalPoints) * 100;

            // Update attempt with error handling
            try {
                await db.query(`
                UPDATE quiz_attempts 
                SET 
                    status = 'completed',
                    score = ?,
                    end_time = CURRENT_TIMESTAMP
                WHERE attempt_id = ?
            `, [score, attempt_id]).catch((error) => {
                    throw new DatabaseError(`Failed to update quiz attempt: ${error.message}`);
                });

                // Get quiz info with error handling
                const [quizInfo]: any = await db.query(`
                SELECT qz.subtopic, t.topic_id
                FROM quizzes qz
                JOIN topics t ON t.course_id = qz.course_id
                WHERE qz.quiz_id = ?
            `, [session.quiz_id]).catch((error) => {
                    throw new DatabaseError(`Failed to fetch quiz info: ${error.message}`);
                });

                if (quizInfo && quizInfo.length > 0) {
                    // Update student progress
                    await this.updateStudentProgress(session.student_id, session.quiz_id, score);
                }


                const quizResults = { score, detailedResponses };

                console.log(`QUIZ RESULTS : ${quizResults}`);

                return quizResults;
            } catch (error) {
                // Roll back responses on final update failure
                await this.rollbackResponses(attempt_id, detailedResponses.map(r => r.response_id!))
                    .catch(rollbackError => console.error('Rollback failed:', rollbackError));
                throw error;
            }
        } catch (error) {
            // Log error for monitoring
            console.error('Quiz submission error:', error);

            // Rethrow with appropriate error type
            if (error instanceof ValidationError ||
                error instanceof QuizAttemptError ||
                error instanceof DatabaseError) {
                throw error;
            }
            throw new Error(`Unexpected error during quiz submission: ${error}`);
        }
    }

    // Helper method for rolling back responses in case of failure
    private static async rollbackResponses(attempt_id: string, responseIds: string[]): Promise<void> {
        if (responseIds.length === 0) return;

        try {
            await db.query(`
            DELETE FROM question_responses 
            WHERE attempt_id = ? AND response_id IN (?)
        `, [attempt_id, responseIds]);
        } catch (error) {
            console.error('Failed to rollback responses:', error);
            throw new DatabaseError('Failed to rollback responses after error');
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

    static async createQuiz(quiz: Quiz): Promise<void> {
        // Convert arrays to JSON strings before inserting
        const quizData = {
            ...quiz,
            learning_objectives: quiz.learning_objectives ? JSON.stringify(quiz.learning_objectives) : null,
            tags: quiz.tags ? JSON.stringify(quiz.tags) : null
        };

        const sql = `
            INSERT INTO quizzes (
                quiz_id,
                course_id,
                topic,
                subtopic,
                difficulty,
                created_by,
                total_questions,
                time_limit,
                passing_score,
                status,
                learning_objectives,
                tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            quizData.quiz_id,
            quizData.course_id,
            quizData.topic,
            quizData.subtopic || null,
            quizData.difficulty,
            quizData.created_by,
            quizData.total_questions,
            quizData.time_limit || null,
            quizData.passing_score || null,
            quizData.status,
            quizData.learning_objectives,
            quizData.tags
        ];

        await db.query(sql, values);

    }

    static async getQuizSessionDetails(attempt_id: string) {
        try {
            // Get the quiz session details
            const session = await QuizSessionService.getQuizAttempt(attempt_id);

            // First, get the quiz attempt to find the associated questions
            const [questions]: any = await db.query(`
                SELECT 
                    q.*,
                    qr.student_answer,
                    qr.is_correct,
                    qr.time_taken
                FROM questions q
                LEFT JOIN question_responses qr 
                    ON q.question_id = qr.question_id 
                    AND qr.attempt_id = ?
                WHERE q.attempt_id = ?
                ORDER BY q.question_id ASC
            `, [attempt_id, attempt_id]);

            // Format the response to match frontend expectations
            const response = {
                attempt_id: session.attempt_id,
                quiz_id: session.quiz_id,
                student_id: session.student_id,
                start_time: session.start_time,
                end_time: session.end_time,
                status: session.status,
                questions: questions.map((q: any) => ({
                    question_id: q.question_id,
                    attempt_id: q.attempt_id,
                    text: q.text,
                    type: q.type,
                    options: q.options ? JSON.parse(q.options) : [],
                    points: q.points,
                    student_answer: q.student_answer || null,
                    is_correct: q.is_correct !== undefined ? q.is_correct : null,
                    time_taken: q.time_taken || null,
                    difficulty: q.difficulty,
                    explanation: q.explanation,
                    hint: q.hint
                })),
                current_question_index: session.current_question_index,
                remaining_time: session.remaining_time,
                score: session.score
            };

            return response;
        } catch (error) {
            console.error('Error in getQuizSessionDetails:', error);
            throw error;
        }
    }

    static async getAllQuizzes(): Promise<Quiz[]> {
        const [rows] = await db.query('SELECT * FROM quizzes');
        return rows as Quiz[];
    }

    static async getQuizzesByCourseId(courseId: string): Promise<Quiz[]> {
        const [rows] = await db.query('SELECT * FROM quizzes WHERE course_id = ?', [courseId]);
        return rows as Quiz[];
    }

    static async getQuizzesByInstructorId(instructorId: string): Promise<Quiz[]> {
        const [rows] = await db.query('SELECT * FROM quizzes WHERE created_by = ?', [instructorId]);
        return rows as Quiz[];
    }
}


class QuizAttemptError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'QuizAttemptError';
    }
}

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}
