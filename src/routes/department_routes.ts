import { Router } from 'express';
import { DepartmentController } from '../controllers/department_controller';

const router = Router();

router.get('/', DepartmentController.getAllDepartments);
router.get('/:department_id', DepartmentController.getDepartmentById);
router.post('/', DepartmentController.createDepartment);
router.put('/:department_id', DepartmentController.updateDepartment);
router.delete('/:department_id', DepartmentController.deleteDepartment);

export default router;
