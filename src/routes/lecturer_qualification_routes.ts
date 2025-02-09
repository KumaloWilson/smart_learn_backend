import { Router } from 'express';
import { LecturerQualificationController } from '../controllers/lecturer_qualification_controler';

const router = Router();

router.get('/', LecturerQualificationController.getAllLecturerQualifications);
router.get('/:lecturer_qualification_id', LecturerQualificationController.getLecturerQualificationById);
router.post('/', LecturerQualificationController.createLecturerQualification);
router.put('/:lecturer_qualification_id', LecturerQualificationController.updateLecturerQualification);
router.delete('/:lecturer_qualification_id', LecturerQualificationController.deleteLecturerQualification);

export default router;
