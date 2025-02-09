import express from 'express';
import { VirtualClassController } from "../controllers/virtual_class_controller";

const router = express.Router();


router.post('/classes/:classId/token', VirtualClassController.generateMeetingToken);
router.post('/classes', VirtualClassController.createClass);
router.get('/classes/course/:courseId', VirtualClassController.getClassesByCourse);
router.get('/classes/class/:classId', VirtualClassController.getClassByClassId);
router.get('/classes/upcoming/:lecturerId', VirtualClassController.getUpcomingClasses);
router.put('/classes/status/:classId', VirtualClassController.updateClassStatus);

export default router;