export interface Question {
    attempt_id: string
    question_id: string;
    text: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    hint?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string;
    subtopic?: string;
    misconception?: string;
    points: number;
    time_estimate: number;
    tags?: string[];
    type: 'multiple_choice' | 'true_false' | 'matching';
    created_at: Date;
    updated_at: Date;
}