import express from 'express';
import { AnalyticsController } from '../controllers/quiz_analytics_controller';
// import { authenticateUser, authenticateInstructor } from '../middleware/auth';

const router = express.Router();

// Student analytics routes
router.get('/student/:student_id', AnalyticsController.getGeneralStudentAnalytics);
// router.get('/student/:student_id/topic/:topic_id', AnalyticsController.getTopicAnalytics);
// router.get('/student/:student_id/weak-areas', AnalyticsController.getWeakAreas);
// router.get('/student/:student_id/learning-path', AnalyticsController.getLearningPath);
// router.get('/student/:student_id/recommendations', AnalyticsController.getRecommendations);


// Instructor analytics routes
router.get('/course/:course_id', AnalyticsController.getGeneralInstructorAnalytics);
// router.get('/course/:course_id/performance',  AnalyticsController.getCoursePerformance);
// router.get('/course/:course_id/misconceptions',  AnalyticsController.getCourseMisconceptions);
// router.get('/topic/:topic_id/analysis',  AnalyticsController.getTopicAnalysis);
// router.get('/class/:class_id/overview',  AnalyticsController.getClassOverview);

export default router;
