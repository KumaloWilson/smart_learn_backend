export interface VirtualClass {
    id: string;
    course_id: string;
    topic_id?: string;
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    meeting_link: string;
    created_by: string;
    is_recurring: boolean;
    recurrence_pattern?: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}
