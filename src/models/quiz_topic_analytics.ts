export interface TopicAnalytics {
    topic: string;
    subtopic?: string;
    difficulty: string;
    average_score: number;
    success_rate: number;
    average_time: number;
    attempt_count: number;
    common_mistakes: string[];
    mastery_level: 'novice' | 'intermediate' | 'expert';
}