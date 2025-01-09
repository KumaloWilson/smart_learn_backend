// validators/quiz_validator.ts
import { Quiz, Question, QuizAnswer } from '../models/quiz';

export function validateQuiz(data: Partial<Quiz>): boolean {
    const requiredFields = ['course_id', 'topic', 'difficulty', 'created_by', 'total_questions'];

    // Check required fields
    for (const field of requiredFields) {
        if (!data[field as keyof typeof data]) {
            return false;
        }
    }

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(data.difficulty!)) {
        return false;
    }

    // Validate numbers
    if (data.total_questions! <= 0) return false;
    if (data.time_limit && data.time_limit <= 0) return false;
    if (data.passing_score && (data.passing_score < 0 || data.passing_score > 100)) return false;

    return true;
}

export function validateQuestion(data: Partial<Question>): boolean {
    const requiredFields = ['text', 'options', 'correct_answer', 'difficulty', 'topic', 'points'];

    // Check required fields
    for (const field of requiredFields) {
        if (!data[field as keyof typeof data]) {
            return false;
        }
    }

    // Validate options
    if (!Array.isArray(data.options) || data.options.length < 2) {
        return false;
    }

    // Validate correct answer
    if (!data.options?.includes(data.correct_answer!)) {
        return false;
    }

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(data.difficulty!)) {
        return false;
    }

    // Validate points
    if (data.points! <= 0) {
        return false;
    }

    return true;
}

export function validateAnswer(data: Partial<QuizAnswer>): boolean {
    const requiredFields = ['attempt_id', 'question_id', 'selected_answer', 'time_taken'];

    // Check required fields
    for (const field of requiredFields) {
        if (!data[field as keyof typeof data]) {
            return false;
        }
    }

    // Validate time taken
    if (data.time_taken! <= 0) {
        return false;
    }

    // Validate confidence level if provided
    if (data.confidence_level && !['high', 'medium', 'low'].includes(data.confidence_level)) {
        return false;
    }

    return true;
}