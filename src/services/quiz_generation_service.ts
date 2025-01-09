import axios from 'axios';
import { Question } from '../models/quiz_question';
import db from '../config/sql_config';
import { v4 as uuidv4 } from 'uuid';

const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY;
const MODEL_URL = 'https://api.deepinfra.com/v1/inference/meta-llama/Llama-3.3-70B-Instruct-Turbo';

export class QuestionGenerationService {
    static async generateQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', count: number, params: {
        subtopic?: string,
        learningObjectives?: string[],
        previousQuestions?: string[]
    }): Promise<Question[]> {
        // Structured prompt to enforce JSON response
        const prompt = `Generate ${count} multiple choice questions about ${topic}${params.subtopic ? ` (${params.subtopic})` : ''} at ${difficulty} level. Return response in this exact JSON format:
        {
          "questions": [
            {
              "text": "question text",
              "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
              "correctAnswer": "A",
              "explanation": "brief explanation",
              "misconception": "common error",
              "hint": "helping hint",
              "timeEstimate": 30,
              "tags": ["tag1", "tag2"]
            }
          ]
        }`;

        try {
            const response = await axios.post(MODEL_URL, {
                input: prompt,
                temperature: 0.7,
                max_tokens: 1000,
                stop: ["</s>", "<|endoftext|>"]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPINFRA_API_KEY}`
                }
            });

            const generatedText = response.data.results[0]?.generated_text;
            if (!generatedText) throw new Error('No response from model');

            // Extract JSON from the response
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON found in response');

            const parsedData = JSON.parse(jsonMatch[0]);
            if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
                throw new Error('Invalid question format');
            }

            return parsedData.questions.map((q: any) => ({
                question_id: uuidv4(),
                text: q.text,
                options: q.options,
                correct_answer: q.correctAnswer,
                explanation: q.explanation,
                difficulty,
                topic,
                subtopic: params.subtopic,
                points: this.calculatePoints(difficulty, q.timeEstimate),
                time_estimate: q.timeEstimate,
                hint: q.hint,
                misconception: q.misconception,
                tags: q.tags,
                type: 'multiple_choice',
                created_at: new Date(),
                updated_at: new Date()
            }));
        } catch (error: any) {
            console.error("Question generation error:", error);
            throw new Error(`Failed to generate questions: ${error.message}`);
        }
    }

    private static calculatePoints(difficulty: string, timeEstimate: number): number {
        const basePoints = {
            easy: 1,
            medium: 2,
            hard: 3
        }[difficulty] || 1;

        return basePoints * Math.ceil(timeEstimate / 30);
    }
}