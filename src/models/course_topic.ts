export interface CourseTopic {
    topic_id: string; // Unique identifier for the topic
    course_id: string; // ID of the course to which the topic belongs
    topic_name: string; // Name of the topic
    description?: string; // Description of the topic (can be null)
    created_at?: string; // Timestamp of when the topic was created
    updated_at?: string; // Timestamp of when the topic was last updated
}
