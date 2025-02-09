
export interface LearningRecommendation {
    recommendation_id: string;
    student_id: string;
    subtopic_id: string;
    recommendation_type: 'practice' | 'review' | 'advance';
    priority: number;
    reason: string;
    created_at: Date;
}