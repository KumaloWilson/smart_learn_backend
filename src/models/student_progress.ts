export interface StudentProgress {
    progress_id: string;
    student_id: string;
    subtopic_id: string;
    mastery_level: number;
    attempts_count: number;
    last_attempt_date?: Date;
    created_at: Date;
    updated_at: Date;
}
