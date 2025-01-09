export interface QuizAnswer {
    answer_id: string;
    attempt_id: string;
    question_id: string;
    selected_answer: string;
    is_correct: boolean;
    time_taken: number;
    points_earned: number;
    review_flag?: boolean;
    student_feedback?: string;
}
