import { Request, Response } from 'express';
import { StudentDocumentService } from '../services/student_documents_service';

export class StudentDocumentController {
    static async getAllDocuments(req: Request, res: Response): Promise<void> {
        try {
            const documents = await StudentDocumentService.getAllDocuments();
            res.json(documents);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getDocumentById(req: Request, res: Response): Promise<void> {
        try {
            const { document_id } = req.params;
            const document = await StudentDocumentService.getDocumentById(document_id);
            if (document) {
                res.json(document);
            } else {
                res.status(404).json({ message: 'Document not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async createDocument(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await StudentDocumentService.createDocument(data);
            res.status(201).json({ message: 'Document created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateDocument(req: Request, res: Response): Promise<void> {
        try {
            const { document_id } = req.params;
            const data = req.body;
            await StudentDocumentService.updateDocument(document_id, data);
            res.json({ message: 'Document updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteDocument(req: Request, res: Response): Promise<void> {
        try {
            const { document_id } = req.params;
            await StudentDocumentService.deleteDocument(document_id);
            res.json({ message: 'Document deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}
