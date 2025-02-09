import axios from 'axios';
import { Question } from '../models/quiz_question';
import { v4 as uuidv4 } from 'uuid';
import { QuestionBankService } from './question_bank_services';

// Types for better type safety
type Difficulty = 'easy' | 'medium' | 'hard';

interface GenerationParams {
    subtopic?: string;
    learningObjectives?: string[];
    previousQuestions?: string[];
    maxAttempts?: number;
}

interface LlamaResponse {
    data: {
        results: Array<{
            generated_text: string;
        }>;
    };
}

interface GeneratedQuestion {
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    misconception: string;
    timeEstimate?: number;
}


export class QuestionGenerationService {
    private static readonly MODEL_URL = 'https://api.deepinfra.com/v1/inference/deepseek-ai/DeepSeek-R1-Distill-Llama-70B';
    private static readonly DEFAULT_MAX_ATTEMPTS = 3;

    static async generateQuestions(
        attempt_id: string,
        topic: string,
        difficulty: Difficulty,
        count: number,
        params: GenerationParams = {}
    ): Promise<Question[]> {
        // Input validation
        if (!attempt_id || !topic || count < 1) {
            throw new Error('Invalid input parameters');
        }

        const maxAttempts = params.maxAttempts || this.DEFAULT_MAX_ATTEMPTS;
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                const prompt = this.constructPrompt(topic, difficulty, count, params);
                const response = await this.callLlamaAPI(prompt);
                const questions = await this.processResponse(response, attempt_id, topic, difficulty, params);

                // Validate generated questions
                if (questions.length !== count) {
                    throw new Error(`Expected ${count} questions but received ${questions.length}`);
                }

                await QuestionBankService.saveQuestions(questions);
                return questions;

            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts}/${maxAttempts} failed:`, error);

                if (attempts === maxAttempts) {
                    throw new Error(`Failed to generate questions after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        }

        throw new Error('Failed to generate questions');
    }

    private static constructPrompt(
        topic: string,
        difficulty: Difficulty,
        count: number,
        params: GenerationParams
    ): string {
        return `Generate ${count} multiple choice questions about ${topic}${params.subtopic ? ` (${params.subtopic})` : ''
            } at ${difficulty} level. ${params.learningObjectives ?
                `Align with these learning objectives: ${params.learningObjectives.join(', ')}. ` :
                ''
            }Don't respond with anything else other than strictly this JSON format:
        {
          "questions": [
            {
              "text": "question text",
              "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
              "correctAnswer": "A",
              "explanation": "brief explanation",
              "misconception": "common error",
              "timeEstimate": 30
            }
          ]
        }`;
    }

    private static async callLlamaAPI(prompt: string): Promise<LlamaResponse> {
        if (!process.env.DEEPINFRA_API_KEY) {
            throw new Error('DEEPINFRA_API_KEY not configured');
        }

        return axios.post(
            this.MODEL_URL,
            {
                input: prompt,
                temperature: 0.7,
                max_tokens: 1000,
                stop: ["</s>", "<|endoftext|>"]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`
                }
            }
        );
    }

    private static async processResponse(
        response: LlamaResponse,
        attempt_id: string,
        topic: string,
        difficulty: Difficulty,
        params: GenerationParams
    ): Promise<Question[]> {
        const generatedText = response.data?.results[0]?.generated_text;
        if (!generatedText) {
            throw new Error('No response from model');
        }

        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        const parsedData = JSON.parse(jsonMatch[0]);
        if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
            throw new Error('Invalid question format');
        }

        return parsedData.questions.map((q: GeneratedQuestion) => ({
            attempt_id,
            question_id: uuidv4(),
            text: q.text,
            options: q.options,
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
            difficulty,
            topic,
            subtopic: params.subtopic,
            points: this.calculatePoints(difficulty, q.timeEstimate),
            misconception: q.misconception,
            type: 'multiple_choice' as const,
            created_at: new Date().toISOString()
        }));
    }

    private static calculatePoints(difficulty: Difficulty, timeEstimate?: number): number {
        const basePoints = {
            easy: 1,
            medium: 2,
            hard: 3
        }[difficulty];

        return basePoints * Math.ceil((timeEstimate || 30) / 30);
    }
}