
export interface QuizAttempt {
    attempt_id: string;
    student_id: string;
    quiz_id: string;
    start_time: Date;
    end_time?: Date;
    score?: number;
    status: 'in_progress' | 'completed' | 'abandoned';
    created_at: Date;
}
