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

    static async getProgramsBySchoolId(school_id: string): Promise<Program[]> {
        console.log('Fetching programs for school_id:', school_id); // Debugging
        const [rows] = await db.query('SELECT * FROM programs WHERE school_id = ?', [school_id]);
        console.log('Query result:', rows); // Debugging
        return rows as Program[];
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
