import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth_routes';
import adminRoutes from './routes/admin_routes';
import adminRoleRoutes from './routes/admin_roles_routes';
import adminSessionRoutes from './routes/admin_sessions_routes';
import passwordResetTokenRoutes from './routes/password_reset_token_routes';
import studentRoutes from './routes/student_routes';
import studentAcademicRecordRoutes from './routes/student_academic_records_routes';
import studentCourseEnrollmentRoutes from './routes/course_enrollment_routes';
import studentDocumentRoutes from './routes/student_documents_routes';
import studentFinancialRecordRoutes from './routes/financial_record_routes';
import studentAttendanceRoutes from './routes/student_attendance_routes';
import lecturerRoutes from './routes/lecturer_routes';
import lecturerQualificationRoutes from './routes/lecturer_qualification_routes';
import lecturerDepartmentAffiliationRoutes from './routes/department_affiliation_routes';
import lecturerCourseAssignmentRoutes from './routes/lecturer_courses_routes';
import courseTopicsRoutes from './routes/course_topics_routes';
import schoolRoutes from './routes/school_routes';
import departmentRoutes from './routes/department_routes';
import programRoutes from './routes/program_routes';
import courseRoutes from './routes/course_routes';
import qualificationTypeRoutes from './routes/qualification_types_routes';
import systemPermissionRoutes from './routes/system_permission_routes';
import rolePermissionRoutes from './routes/role_permissions_routes';
import auditLogRoutes from './routes/audit_log_routes';
import quizGenerationRoutes from './routes/quiz_generation_routes';
import quizSessionRoutes from './routes/quiz_attempt_routes';
import quizAnalyticsRoutes from './routes/analytics_routes';
import quizResponsesRoutes from './routes/quiz_response_router';
import studentQuizResponsesRoutes from './routes/student_quiz_response_routes';
import virtualClassesRoutes from './routes/virtual_classes_router';

const app = express();

// Configure CORS
const corsOptions = {
    origin: '*', // Allow requests from any origin. Replace '*' with specific origins for stricter security.
    methods: 'GET,POST,PUT,DELETE, PATCH', // Specify allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
};

app.use(cors(corsOptions)); // Apply CORS middleware

app.use(express.json());

// Group Routes by Category

// Authentication Routes
app.use('/api/v1/auth', authRoutes);

// Admin Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/admin/roles', adminRoleRoutes);
app.use('/api/v1/admin/sessions', adminSessionRoutes);

// Student Routes
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/student/academic/records', studentAcademicRecordRoutes);
app.use('/api/v1/student/course/enrollments', studentCourseEnrollmentRoutes);
app.use('/api/v1/student/documents', studentDocumentRoutes);
app.use('/api/v1/student/financial/records', studentFinancialRecordRoutes);
app.use('/api/v1/student/attendance', studentAttendanceRoutes);

// Lecturer Routes
app.use('/api/v1/lecturer', lecturerRoutes);
app.use('/api/v1/lecturer/qualifications', lecturerQualificationRoutes);
app.use('/api/v1/lecturer/department/affiliations', lecturerDepartmentAffiliationRoutes);
app.use('/api/v1/lecturer/course/assignments', lecturerCourseAssignmentRoutes);
app.use('/api/v1/lecturer/course/topics', courseTopicsRoutes);

// School, Department, Program, Course Routes
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/courses', courseRoutes);

// Qualification Type Routes
app.use('/api/v1/qualification/types', qualificationTypeRoutes);

//Quiz Routes
app.use('/api/v1/quiz/generate', quizGenerationRoutes)
app.use('/api/v1/quiz/session', quizSessionRoutes);
app.use('/api/v1/quiz/responses', quizResponsesRoutes);
app.use('/api/v1/quiz/student/responses', studentQuizResponsesRoutes);
app.use('/api/v1/quiz/analytics', quizAnalyticsRoutes);

//Virtual Classes
app.use('/api/v1/virtual', virtualClassesRoutes);


// Permissions Routes
app.use('/api/v1/permissions/system', systemPermissionRoutes);
app.use('/api/v1/permissions/roles', rolePermissionRoutes);

// Audit Routes
app.use('/api/v1/audit/logs', auditLogRoutes);

// Password Reset Routes
app.use('/api/v1/password/reset/tokens', passwordResetTokenRoutes);

export default app;
