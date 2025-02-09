import { TopicPerformance } from '../models/student_topic_perfomance';

export interface StudentAnalytics {
    student_id: string;
    overall_progress: number;
    topic_performances: TopicPerformance[];
    learning_path: string[];
    weak_areas: string[];
    strong_areas: string[];
}