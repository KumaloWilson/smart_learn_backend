import db from '../config/sql_config';
import { Program } from '../models/program';

export class ProgramService {
    static async getAllPrograms(): Promise<Program[]> {
        const [rows] = await db.query('SELECT * FROM programs');
        return rows as Program[];
    }

    static async getProgramById(program_id: string): Promise<Program | null> {
        const [rows]: any = await db.query('SELECT * FROM programs WHERE program_id = ?', [program_id]);
        return rows[0] || null;
    }

    static async createProgram(program: Program): Promise<void> {
        const sql = `INSERT INTO programs SET ?`;
        await db.query(sql, program);
    }

    static async updateProgram(program_id: string, program: Partial<Program>): Promise<void> {
        const sql = `UPDATE programs SET ? WHERE program_id = ?`;
        await db.query(sql, [program, program_id]);
    }

    static async deleteProgram(program_id: string): Promise<void> {
        await db.query('DELETE FROM programs WHERE program_id = ?', [program_id]);
    }
}
