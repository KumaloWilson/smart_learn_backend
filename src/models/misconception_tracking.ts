export interface MisconceptionTracking {
    tracking_id: string;
    student_id: string;
    subtopic_id: string;
    misconception_type: string;
    frequency: number;
    last_occurrence: Date;
    created_at: Date;
    updated_at: Date;
}