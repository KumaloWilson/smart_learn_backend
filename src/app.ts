import express from 'express';
import authRoutes from './routes/auth_routes';
import adminRoutes from './routes/admin_routes'

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);


export default app;
