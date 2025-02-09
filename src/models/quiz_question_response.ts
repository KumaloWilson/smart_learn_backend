export interface QuestionResponse {
    response_id: string;
    attempt_id: string;
    question_id: string;
    student_answer: string;
    is_correct: boolean;
    time_taken?: number;
    created_at?: Date;
    points_earned?: number;
    feedback?: string;
}