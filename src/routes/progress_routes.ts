import express from 'express';
import { ProgressController } from '../controllers/progress_controller';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Progress tracking routes
router.get('/student/:student_id', authenticateUser, ProgressController.getStudentProgress);
router.get('/student/:student_id/course/:course_id', authenticateUser, ProgressController.getCourseProgress);
router.get('/student/:student_id/topic/:topic_id', authenticateUser, ProgressController.getTopicProgress);
router.get('/student/:student_id/mastery', authenticateUser, ProgressController.getMasteryLevels);
router.get('/student/:student_id/timeline', authenticateUser, ProgressController.getLearningTimeline);

export default router;

