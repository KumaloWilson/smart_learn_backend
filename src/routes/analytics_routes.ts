import express from 'express';
import { AnalyticsController } from '../controllers/analytics_controller';
import { authenticateUser, authenticateInstructor } from '../middleware/auth';

const router = express.Router();

// Student analytics routes
router.get('/student/:student_id', authenticateUser, AnalyticsController.getStudentAnalytics);
router.get('/student/:student_id/topic/:topic_id', authenticateUser, AnalyticsController.getTopicAnalytics);
router.get('/student/:student_id/weak-areas', authenticateUser, AnalyticsController.getWeakAreas);
router.get('/student/:student_id/learning-path', authenticateUser, AnalyticsController.getLearningPath);
router.get('/student/:student_id/recommendations', authenticateUser, AnalyticsController.getRecommendations);

// Instructor analytics routes
router.get('/course/:course_id', authenticateInstructor, AnalyticsController.getInstructorAnalytics);
router.get('/course/:course_id/performance', authenticateInstructor, AnalyticsController.getCoursePerformance);
router.get('/course/:course_id/misconceptions', authenticateInstructor, AnalyticsController.getCourseMisconceptions);
router.get('/topic/:topic_id/analysis', authenticateInstructor, AnalyticsController.getTopicAnalysis);
router.get('/class/:class_id/overview', authenticateInstructor, AnalyticsController.getClassOverview);

export default router;
