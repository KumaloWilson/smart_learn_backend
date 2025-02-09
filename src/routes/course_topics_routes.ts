import { Router } from 'express';
import { CourseTopicController } from '../controllers/course_topics_controller';

const router = Router();

// Get all topics
router.get('/', CourseTopicController.getAllTopics);

// Get topic by ID
router.get('/:topic_id', CourseTopicController.getTopicById);

// Get topics by course ID
router.get('/course/:course_id', CourseTopicController.getTopicsByCourseId);

// Create a new topic
router.post('/', CourseTopicController.createTopic);

// Update an existing topic
router.put('/:topic_id', CourseTopicController.updateTopic);

// Delete a topic
router.delete('/:topic_id', CourseTopicController.deleteTopic);

// Get topics by course ID and name
router.get('/course/:course_id/:topic_name', CourseTopicController.getTopicsByCourseIdAndName);

export default router;
