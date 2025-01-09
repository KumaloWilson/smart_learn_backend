
export interface StudentProgress {
    student_id: string;
    course_id: string;
    topic: string;
    total_attempts: number;
    best_score: number;
    average_score: number;
    weak_areas: string[];
    strong_areas: string[];
    time_spent: number;
    last_attempt_date: Date;
    improvement_rate: number;
}