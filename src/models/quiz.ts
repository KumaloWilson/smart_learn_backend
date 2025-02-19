export interface Quiz {
    quiz_id: string;
    course_id: string;
    topic: string;
    subtopic?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    created_by: string;
    creator_role: 'lecturer' | 'student';
    total_questions: number;
    time_limit?: number;
    passing_score?: number;
    status: 'draft' | 'active' | 'archived';
    learning_objectives?: string[];
    tags?: string[];
    created_at: Date;
    updated_at: Date;
    expires_at: Date;
    visibility?: 'private' | 'public';
}
