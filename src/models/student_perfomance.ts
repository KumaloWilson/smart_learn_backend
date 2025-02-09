
export interface StudentPerformanceMetrics {
    metric_id: string;
    student_id: string;
    course_id: string;
    subtopic_id: string;
    total_questions: number;
    correct_answers: number;
    average_time_per_question: number;
    mastery_level: number;
    last_attempt_date: Date;
    updated_at: Date;
}
