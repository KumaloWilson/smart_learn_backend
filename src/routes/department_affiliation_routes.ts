import { Router } from 'express';
import { LecturerDepartmentAffiliationController } from '../controllers/department_affiliation_controller';

const router = Router();

router.get('/', LecturerDepartmentAffiliationController.getAllAffiliations);
router.get('/:affiliation_id', LecturerDepartmentAffiliationController.getAffiliationById);
router.post('/', LecturerDepartmentAffiliationController.createAffiliation);
router.put('/:affiliation_id', LecturerDepartmentAffiliationController.updateAffiliation);
router.delete('/:affiliation_id', LecturerDepartmentAffiliationController.deleteAffiliation);

export default router;
