import { QuizAnswer } from "./quiz_answer";

export interface QuizAttempt {
    attempt_id: string;
    quiz_id: string;
    student_id: string;
    score: number;
    max_possible_score: number;
    percentage: number;
    start_time: Date;
    end_time?: Date;
    status: 'in_progress' | 'completed' | 'abandoned';
    time_spent: number;
    answers: QuizAnswer[];
    feedback?: string;
}