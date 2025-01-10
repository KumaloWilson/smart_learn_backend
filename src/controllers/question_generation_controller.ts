import { Request, Response } from 'express';
import { QuestionGenerationService } from '../services/quiz_generation_service';

export class QuestionGenerationController {
    static async generateQuestions(req: Request, res: Response) {
        try {
            const {
                topic,
                difficulty,
                count,
                subtopic,
                learningObjectives,
                previousQuestions
            } = req.body;

            const questions = await QuestionGenerationService.generateQuestions(
                '',
                topic,
                difficulty,
                count,
                { subtopic, learningObjectives, previousQuestions }
            );

            res.status(201).json({ questions });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }
}
