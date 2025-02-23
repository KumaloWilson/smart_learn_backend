import {QuizAttempt} from "./quiz_attempt";

export interface StudentPerformance extends QuizAttempt {
    student_name: string;
    registration_number: string;
    email: string;
    enrollment_status: string;
    quiz_title: string;
    topic: string;
    questions_correct?: number;
    total_questions: number;
    time_spent?: number;
    attempt_number: number;
}