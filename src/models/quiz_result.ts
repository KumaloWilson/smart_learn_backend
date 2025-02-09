export interface QuizResult {
    score: number;
    statistics: {
        total_questions: number;
        correct_answers: number;
        avg_time_per_question: number;
    };
    responses: {
        question_id: string;
        text: string;
        student_answer: string;
        correct_answer: string;
        is_correct: boolean;
        points_earned: number;
    }[];
}