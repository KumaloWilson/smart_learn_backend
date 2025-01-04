import express from 'express';
import authRoutes from './routes/auth_routes';
import adminRoutes from './routes/admin_routes';
import studentRoutes from './routes/student_routes'
import lecturerRoutes from './routes/lecturer_routes'

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/lecturer', lecturerRoutes);


export default app;
