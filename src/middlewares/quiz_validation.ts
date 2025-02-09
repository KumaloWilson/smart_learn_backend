import { Request, Response, NextFunction } from 'express';

export const validateQuizSubmission = (req: Request, res: Response, next: NextFunction) => {
    const { attempt_id, responses } = req.body;

    if (!attempt_id || !responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: 'Invalid submission format' });
    }

    for (const response of responses) {
        if (!response.question_id || !response.student_answer) {
            return res.status(400).json({ error: 'Invalid response format' });
        }
    }

    next();
};