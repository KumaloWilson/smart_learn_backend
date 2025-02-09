import { Request, Response } from 'express';
import { StudentDocumentService } from '../services/student_documents_service';

export class StudentDocumentController {
    static async getAllDocuments(req: Request, res: Response): Promise<void> {
        try {
            const documents = await StudentDocumentService.getAllDocuments();
            res.json({
                success: true,
                data: documents,
                message: 'All documents retrieved successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve documents.',
                error: err
            });
        }
    }

    static async getDocumentById(req: Request, res: Response): Promise<void> {
        try {
            const { document_id } = req.params;
            const document = await StudentDocumentService.getDocumentById(document_id);
            if (document) {
                res.json({
                    success: true,
                    data: document,
                    message: 'Document retrieved successfully.'
                });
            } else {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Document not found.'
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to retrieve document.',
                error: err
            });
        }
    }

    static async createDocument(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            await StudentDocumentService.createDocument(data);
            res.status(201).json({
                success: true,
                data: null,
                message: 'Document created successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to create document.',
                error: err
            });
        }
    }

    static async updateDocument(req: Request, res: Response): Promise<void> {
        try {
            const { document_id } = req.params;
            const data = req.body;
            await StudentDocumentService.updateDocument(document_id, data);
            res.json({
                success: true,
                data: null,
                message: 'Document updated successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to update document.',
                error: err
            });
        }
    }

    static async deleteDocument(req: Request, res: Response): Promise<void> {
        try {
            const { document_id } = req.params;
            await StudentDocumentService.deleteDocument(document_id);
            res.json({
                success: true,
                data: null,
                message: 'Document deleted successfully.'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                data: null,
                message: 'Failed to delete document.',
                error: err
            });
        }
    }
}
