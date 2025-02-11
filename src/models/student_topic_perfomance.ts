import { StudentTopicPerformance } from './student_sub_topic_perfomance';

export interface StudentCoursePerformance {
    topic_id: string;
    topic_name: string;
    average_score: number;
    completion_rate: number;
    weak_subtopics: StudentTopicPerformance[];
    strong_subtopics: StudentTopicPerformance[];
    recommended_actions: string[];
}


