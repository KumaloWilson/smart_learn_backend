
// routes/progress_tracking_routes.ts
import express from 'express';
import { ProgressTrackingController } from '../controllers/progress_tracking_controller';
// import { authenticateUser, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Student progress routes
router.get(
    '/student/:student_id/course/:course_id',
    ProgressTrackingController.getStudentProgress
);

router.get(
    '/mastery/:student_id/topic/:topic',
    ProgressTrackingController.getTopicMastery
);

router.get(
    '/study-plan/:student_id/course/:course_id',
    ProgressTrackingController.generateStudyPlan
);

export default router;