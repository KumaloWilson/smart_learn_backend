import { Router } from 'express';
import { StudentDocumentController } from '../controllers/student_documents_controller';

const router = Router();

router.get('/', StudentDocumentController.getAllDocuments);
router.get('/:document_id', StudentDocumentController.getDocumentById);
router.post('/', StudentDocumentController.createDocument);
router.put('/:document_id', StudentDocumentController.updateDocument);
router.delete('/:document_id', StudentDocumentController.deleteDocument);

export default router;
