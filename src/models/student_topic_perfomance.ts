import { SubtopicPerformance } from './student_sub_topic_perfomance';

export interface TopicPerformance {
    topic_id: string;
    topic_name: string;
    average_score: number;
    completion_rate: number;
    weak_subtopics: SubtopicPerformance[];
    strong_subtopics: SubtopicPerformance[];
    recommended_actions: string[];
}