import { Router } from 'express';
import { LecturerController } from '../controllers/lecturer_controller';

const router = Router();

router.get('/', LecturerController.getAllLecturers);
router.get('/:lecturer_id', LecturerController.getLecturerByUID);
router.post('/', LecturerController.createLecturer);
router.put('/:lecturer_id', LecturerController.updateLecturer);
router.delete('/:lecturer_id', LecturerController.deleteLecturer);

export default router;
