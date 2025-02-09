import { Router } from 'express';
import { StudentFinancialRecordController } from '../controllers/financial_record_controller';

const router = Router();

router.get('/', StudentFinancialRecordController.getAllFinancialRecords);
router.get('/:finance_id', StudentFinancialRecordController.getFinancialRecordById);
router.post('/', StudentFinancialRecordController.createFinancialRecord);
router.put('/:finance_id', StudentFinancialRecordController.updateFinancialRecord);
router.delete('/:finance_id', StudentFinancialRecordController.deleteFinancialRecord);

export default router;
