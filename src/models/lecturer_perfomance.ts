
export interface LecturerTopicPerformance {
    topic_id: string;
    topic_name: string;
    avg_mastery_level: number;
    mastery_rate: number;
    students_attempted: number;
    quiz_completion_rate: number;
    avg_quiz_score: number;
    difficulty_distribution: Record<string, number>;
}