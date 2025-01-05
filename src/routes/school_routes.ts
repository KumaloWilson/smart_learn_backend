import { Router } from 'express';
import { SchoolController } from '../controllers/school_controller';

const router = Router();

router.get('/', SchoolController.getAllSchools);
router.get('/:school_id', SchoolController.getSchoolById);
router.post('/', SchoolController.createSchool);
router.put('/:school_id', SchoolController.updateSchool);
router.delete('/:school_id', SchoolController.deleteSchool);

export default router;
