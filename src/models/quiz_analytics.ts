
export interface QuizAnalytics {
    quiz_id: string;
    topic: string;
    difficulty: string;
    avg_score: number;
    attempt_count: number;
    completion_rate: number;
    avg_duration: number;
}