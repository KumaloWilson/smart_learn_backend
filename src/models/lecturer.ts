import db from '../config/sql_config';

export class LecturerModel {
    async getProfile(uid: string): Promise<any> {
        const [rows]: any = await db.query('SELECT * FROM lecturers WHERE uid = ?', [uid]);
        return rows.length > 0 ? rows[0] : null;
    }

    async createProfile(lecturer: any): Promise<void> {
        await db.query('INSERT INTO lecturers (uid, name, subject) VALUES (?, ?, ?)', [
            lecturer.uid,
            lecturer.name,
            lecturer.subject,
        ]);
    }

    async updateProfile(uid: string, updates: Partial<any>): Promise<void> {
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        await db.query(`UPDATE lecturers SET ${fields} WHERE uid = ?`, [...values, uid]);
    }
}
