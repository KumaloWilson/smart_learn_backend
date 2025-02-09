import db from '../config/sql_config';
import { StudentCourseEnrollment } from '../models/course_enrollment';
import { Course } from '../models/course';
import { AttendanceRecord, CourseEnrollmentBasic, StudentCourseEnrollmentDetails, ProgressRecord } from '../models/student_course_enrollment';

export class StudentCourseService {
    // Get all courses for a specific student
    static async getStudentCourses(student_id: string): Promise<(StudentCourseEnrollment & Course)[]> {
        const sql = `
            SELECT sce.*, c.*
            FROM student_course_enrollments sce
            JOIN courses c ON sce.course_id = c.course_id
            WHERE sce.student_id = ?
            ORDER BY sce.academic_year DESC, sce.semester DESC`;

        const [rows] = await db.query(sql, [student_id]);
        return rows as (StudentCourseEnrollment & Course)[];
    }

    // Get current semester courses for a student
    static async getCurrentEnrolledSemesterCourses(student_id: string): Promise<(StudentCourseEnrollment & Course)[]> {
        const sql = `
        SELECT 
            sce.enrollment_id,
            sce.student_id,
            sce.course_id,
            sce.academic_year,
            sce.semester,
            sce.enrollment_date,
            sce.grade,
            sce.grade_points,
            sce.attendance_percentage,
            sce.status,             /* This will be the enrollment status */
            sce.is_retake,
            sce.created_at,
            sce.updated_at,
            c.program_id,
            c.course_name,
            c.course_code,
            c.period_id,
            c.phase,
            c.credit_hours,
            c.description,
            c.prerequisites,
            c.semester_offered,
            c.course_level,
            c.is_elective,
            c.syllabus_path
        FROM student_course_enrollments sce
        JOIN courses c ON sce.course_id = c.course_id
        WHERE sce.student_id = ?
        AND c.status = 'active'     /* Filter by active courses but don't select the course status */
        AND sce.academic_year = (
            SELECT academic_year 
            FROM student_course_enrollments 
            WHERE student_id = ? 
            ORDER BY enrollment_date DESC 
            LIMIT 1
        )
        AND sce.semester = (
            SELECT semester 
            FROM student_course_enrollments 
            WHERE student_id = ? 
            ORDER BY enrollment_date DESC 
            LIMIT 1
        )`;
        const [rows] = await db.query(sql, [student_id, student_id, student_id]);
        return rows as (StudentCourseEnrollment & Course)[];
    }
    // Get student's course history with grades
    static async getStudentCourseHistory(student_id: string): Promise<(StudentCourseEnrollment & Course)[]> {
        const sql = `
            SELECT sce.*, c.*
            FROM student_course_enrollments sce
            JOIN courses c ON sce.course_id = c.course_id
            WHERE sce.student_id = ?
            AND sce.status IN ('completed', 'failed')
            ORDER BY sce.academic_year DESC, sce.semester DESC`;

        const [rows] = await db.query(sql, [student_id]);
        return rows as (StudentCourseEnrollment & Course)[];
    }

    // Calculate student's GPA for a specific semester
    static async getStudentSemesterGPA(
        student_id: string,
        academic_year: string,
        semester: string
    ): Promise<{ gpa: number; totalCredits: number }> {
        const sql = `
            SELECT 
                SUM(c.credit_hours * sce.grade_points) as total_points,
                SUM(c.credit_hours) as total_credits
            FROM student_course_enrollments sce
            JOIN courses c ON sce.course_id = c.course_id
            WHERE sce.student_id = ?
            AND sce.academic_year = ?
            AND sce.semester = ?
            AND sce.status = 'completed'`;

        const [rows]: any = await db.query(sql, [student_id, academic_year, semester]);

        if (!rows[0].total_credits) return { gpa: 0, totalCredits: 0 };

        return {
            gpa: Number((rows[0].total_points / rows[0].total_credits).toFixed(2)),
            totalCredits: rows[0].total_credits
        };
    }

    // Enroll student in a course
    static async enrollStudentInCourse(enrollment: StudentCourseEnrollment): Promise<void> {
        // Check if student is already enrolled in the course
        const [existing]: any = await db.query(
            'SELECT * FROM student_course_enrollments WHERE student_id = ? AND course_id = ? AND academic_year = ? AND semester = ?',
            [enrollment.student_id, enrollment.course_id, enrollment.academic_year, enrollment.semester]
        );

        if (existing.length > 0) {
            throw new Error('Student is already enrolled in this course for the specified semester');
        }

        const sql = `INSERT INTO student_course_enrollments SET ?`;
        await db.query(sql, enrollment);
    }

    static async bulkEnrollInCourses(enrollments: StudentCourseEnrollment[]): Promise<void> {
        // Start a transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Check for existing enrollments
            for (const enrollment of enrollments) {
                const [existing]: any = await connection.query(
                    'SELECT * FROM student_course_enrollments WHERE student_id = ? AND course_id = ? AND academic_year = ? AND semester = ?',
                    [enrollment.student_id, enrollment.course_id, enrollment.academic_year, enrollment.semester]
                );

                if (existing.length > 0) {
                    throw new Error('Student is already enrolled in one or more selected courses for the specified semester');
                }
            }

            // Format the date properly for MySQL
            const formatDate = (date: string | Date) => {
                const d = new Date(date);
                return d.toISOString().slice(0, 19).replace('T', ' ');
            };

            // If no existing enrollments found, proceed with bulk insert
            const sql = `INSERT INTO student_course_enrollments (enrollment_id, student_id, course_id, enrollment_date, academic_year, semester, status) VALUES ?`;
            const values = enrollments.map(e => [
                e.enrollment_id,
                e.student_id,
                e.course_id,
                formatDate(e.enrollment_date), // Format the date here
                e.academic_year,
                e.semester,
                e.status
            ]);

            await connection.query(sql, [values]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Update student's course enrollment (e.g., grade, status)
    static async updateStudentCourseEnrollment(
        enrollment_id: string,
        updates: Partial<StudentCourseEnrollment>
    ): Promise<void> {
        const sql = `UPDATE student_course_enrollments SET ? WHERE enrollment_id = ?`;
        await db.query(sql, [updates, enrollment_id]);
    }

    // Get enrollment details for a specific course
    static async getEnrollmentDetails(
        student_id: string,
        course_id: string
    ): Promise<StudentCourseEnrollment | null> {
        const [rows]: any = await db.query(
            'SELECT * FROM student_course_enrollments WHERE student_id = ? AND course_id = ?',
            [student_id, course_id]
        );
        return rows[0] || null;
    }


    static async getCourseEnrollmentDetails(course_id: string): Promise<StudentCourseEnrollmentDetails[]> {
        try {
            // First, get the basic enrollment and student data
            const basicSql = `
                SELECT 
                    sce.enrollment_id,
                    sce.student_id,
                    sce.course_id,
                    sce.academic_year,
                    sce.semester,
                    sce.enrollment_date,
                    sce.grade,
                    sce.grade_points,
                    sce.attendance_percentage,
                    sce.status,
                    sce.is_retake,
                    sce.created_at,
                    sce.updated_at,
                    s.registration_number,
                    s.first_name,
                    s.middle_name,
                    s.last_name,
                    s.email,
                    s.enrollment_status
                FROM student_course_enrollments sce
                JOIN students s ON sce.student_id = s.student_id
                WHERE sce.course_id = ?
            `;

            const [basicRows] = await db.query(basicSql, [course_id]);
            const enrollments = basicRows as CourseEnrollmentBasic[];

            // Then, for each enrollment, get the attendance and progress records
            const result: StudentCourseEnrollmentDetails[] = await Promise.all(
                enrollments.map(async (enrollment) => {
                    // Get attendance records
                    const attendanceSql = `
                        SELECT 
                            attendance_id,
                            class_date,
                            status,
                            remarks
                        FROM student_attendance
                        WHERE student_id = ? AND course_id = ?
                    `;
                    const [attendanceRows] = await db.query(attendanceSql, [
                        enrollment.student_id,
                        course_id
                    ]);

                    // Get progress records
                    const progressSql = `
                        SELECT 
                            progress_id,
                            subtopic_id,
                            mastery_level,
                            attempts_count,
                            last_attempt_date
                        FROM student_progress
                        WHERE student_id = ?
                    `;
                    const [progressRows] = await db.query(progressSql, [enrollment.student_id]);

                    return {
                        ...enrollment,
                        attendance_records: attendanceRows as AttendanceRecord[],
                        progress_records: progressRows as ProgressRecord[]
                    };
                })
            );

            return result;
        } catch (error) {
            console.error('Error in getCourseEnrollmentDetails:', error);
            throw error;
        }
    }

    static async getCourseEnrollmentDetailsWithFilters(
        course_id: string,
        filters: {
            enrollment_status?: 'active' | 'suspended' | 'graduated' | 'withdrawn' | 'deferred';
            academic_year?: string;
            semester?: '1' | '2';
        }
    ): Promise<StudentCourseEnrollmentDetails[]> {
        try {
            let basicSql = `
                SELECT 
                    sce.enrollment_id,
                    sce.student_id,
                    sce.course_id,
                    sce.academic_year,
                    sce.semester,
                    sce.enrollment_date,
                    sce.grade,
                    sce.grade_points,
                    sce.attendance_percentage,
                    sce.status,
                    sce.is_retake,
                    sce.created_at,
                    sce.updated_at,
                    s.registration_number,
                    s.first_name,
                    s.middle_name,
                    s.last_name,
                    s.email,
                    s.enrollment_status
                FROM student_course_enrollments sce
                JOIN students s ON sce.student_id = s.student_id
                WHERE sce.course_id = ?
            `;

            const params: any[] = [course_id];

            if (filters.enrollment_status) {
                basicSql += ' AND s.enrollment_status = ?';
                params.push(filters.enrollment_status);
            }

            if (filters.academic_year) {
                basicSql += ' AND sce.academic_year = ?';
                params.push(filters.academic_year);
            }

            if (filters.semester) {
                basicSql += ' AND sce.semester = ?';
                params.push(filters.semester);
            }

            const [basicRows] = await db.query(basicSql, params);
            const enrollments = basicRows as CourseEnrollmentBasic[];

            const result: StudentCourseEnrollmentDetails[] = await Promise.all(
                enrollments.map(async (enrollment) => {
                    const [attendanceRows] = await db.query(
                        `SELECT 
                            attendance_id,
                            class_date,
                            status,
                            remarks
                        FROM student_attendance
                        WHERE student_id = ? AND course_id = ?`,
                        [enrollment.student_id, course_id]
                    );

                    const [progressRows] = await db.query(
                        `SELECT 
                            progress_id,
                            subtopic_id,
                            mastery_level,
                            attempts_count,
                            last_attempt_date
                        FROM student_progress
                        WHERE student_id = ?`,
                        [enrollment.student_id]
                    );

                    return {
                        ...enrollment,
                        attendance_records: attendanceRows as AttendanceRecord[],
                        progress_records: progressRows as ProgressRecord[]
                    };
                })
            );

            return result;
        } catch (error) {
            console.error('Error in getCourseEnrollmentDetailsWithFilters:', error);
            throw error;
        }
    }
}