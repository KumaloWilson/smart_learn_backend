export interface QuizSession {
    attempt_id: string;
    quiz_id: string;
    student_id: string;
    start_time: Date;
    end_time?: Date;
    current_question_index: number;
    remaining_time: number;
    status: 'in_progress' | 'completed' | 'abandoned' | 'timed_out';
    score?: number;
}