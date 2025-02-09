import db from '../config/sql_config';
import { Department } from '../models/department';

export class DepartmentService {
    static async getAllDepartments(): Promise<Department[]> {
        const [rows] = await db.query('SELECT * FROM departments');
        return rows as Department[];
    }

    static async getDepartmentById(department_id: string): Promise<Department | null> {
        const [rows]: any = await db.query('SELECT * FROM departments WHERE department_id = ?', [department_id]);
        return rows[0] || null;
    }

    static async getDepartmentsBySchoolId(school_id: string): Promise<Department[]> {
        console.log('Fetching departments for school_id:', school_id); // Debugging
        const [rows] = await db.query('SELECT * FROM departments WHERE school_id = ?', [school_id]);
        console.log('Query result:', rows); // Debugging
        return rows as Department[];
    }


    static async createDepartment(department: Department): Promise<void> {
        const sql = `INSERT INTO departments SET ?`;
        await db.query(sql, department);
    }

    static async updateDepartment(department_id: string, department: Partial<Department>): Promise<void> {
        const sql = `UPDATE departments SET ? WHERE department_id = ?`;
        await db.query(sql, [department, department_id]);
    }

    static async deleteDepartment(department_id: string): Promise<void> {
        await db.query('DELETE FROM departments WHERE department_id = ?', [department_id]);
    }
}
