import { Router } from 'express';
import { ProgramController } from '../controllers/program_controller';

const router = Router();

router.get('/', ProgramController.getAllPrograms);
router.get('/school/:school_id', ProgramController.getProgramsBySchoolId);
router.get('/:program_id', ProgramController.getProgramById);
router.post('/', ProgramController.createProgram);
router.put('/:program_id', ProgramController.updateProgram);
router.delete('/:program_id', ProgramController.deleteProgram);

export default router;
