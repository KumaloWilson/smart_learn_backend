import db from '../config/sql_config';

export class StudentModel {
    async getProfile(uid: string): Promise<any> {
        const [rows]: any = await db.query('SELECT * FROM students WHERE uid = ?', [uid]);
        return rows.length > 0 ? rows[0] : null;
    }

    async createProfile(student: any): Promise<void> {
        await db.query('INSERT INTO students (uid, name, course) VALUES (?, ?, ?)', [
            student.uid,
            student.name,
            student.course,
        ]);
    }

    async updateProfile(uid: string, updates: Partial<any>): Promise<void> {
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        await db.query(`UPDATE students SET ${fields} WHERE uid = ?`, [...values, uid]);
    }
}
