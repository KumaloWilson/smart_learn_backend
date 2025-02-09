import db from '../config/sql_config';
import { Student } from '../models/student';
import {StudentAcademicProfile} from "../models/student_academic_profile";

export class StudentService {
    static async getAllStudents(): Promise<Student[]> {
        const [rows] = await db.query('SELECT * FROM students');
        return rows as Student[];
    }

    static async getStudentByStudentID(student_id: string): Promise<Student | null> {
        const [rows]: any = await db.query('SELECT * FROM students WHERE student_id = ?', [student_id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async createStudent(student: Student): Promise<Student | null> {
        const sql = `INSERT INTO students SET ?`;
        await db.query(sql, student);

        return student;
    }

    static async updateStudent(student_id: string, student: Partial<Student>): Promise<void> {
        const sql = `UPDATE students SET ? WHERE student_id = ?`;
        await db.query(sql, [student, student_id]);
    }

    static async deleteStudent(student_id: string): Promise<void> {
        await db.query('DELETE FROM students WHERE student_id = ?', [student_id]);
    }

    static async getStudentProfileByStudentID(student_id: string): Promise<StudentAcademicProfile | null> {
        const query = `
            SELECT 
                s.*,
                ar.record_id,
                ar.program_id,
                ar.academic_year,
                ar.semester,
                ar.level,
                ar.gpa,
                ar.cgpa,
                ar.total_credits_earned,
                ar.academic_standing,
                ar.comments as academic_comments,
                ar.created_at as academic_record_created_at,
                ar.updated_at as academic_record_updated_at
            FROM 
                students s
            LEFT JOIN 
                student_academic_records ar ON s.student_id = ar.student_id
            WHERE 
                s.student_id = ?
            ORDER BY 
                ar.academic_year DESC, 
                ar.semester DESC 
            LIMIT 1`;

        const [rows]: any = await db.query(query, [student_id]);

        if (rows.length === 0) {
            return null;
        }

        // Transform the flat result into nested StudentProfile object
        const row = rows[0];
        const studentProfile: StudentAcademicProfile = {
            // Student properties
            student_id: row.student_id,
            registration_number: row.registration_number,
            first_name: row.first_name,
            middle_name: row.middle_name,
            last_name: row.last_name,
            date_of_birth: row.date_of_birth,
            gender: row.gender,
            email: row.email,
            personal_email: row.personal_email,
            phone: row.phone,
            address: row.address,
            nationality: row.nationality,
            national_id: row.national_id,
            passport_number: row.passport_number,
            emergency_contact_name: row.emergency_contact_name,
            emergency_contact_phone: row.emergency_contact_phone,
            emergency_contact_relationship: row.emergency_contact_relationship,
            admission_date: row.admission_date,
            current_program_id: row.current_program_id,
            enrollment_status: row.enrollment_status,
            photo_url: row.photo_url,
        };

        if (row.record_id) {
            studentProfile.academic_record = {
                record_id: row.record_id,
                student_id: row.student_id,
                program_id: row.program_id,
                academic_year: row.academic_year,
                semester: row.semester,
                level: row.level,
                gpa: row.gpa,
                cgpa: row.cgpa,
                total_credits_earned: row.total_credits_earned,
                academic_standing: row.academic_standing,
                comments: row.academic_comments,
            };
        }

        return studentProfile;
    }
}
