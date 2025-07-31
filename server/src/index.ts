import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import attendanceRoutes from './routes/attendance.routes';
import fileUploadRoutes from './routes/fileupload.routes';
import { clearAttendanceQueue } from './utils/attendance.util';

import './workers/attendance.worker';
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.get('/', clearAttendanceQueue);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/file-upload', fileUploadRoutes);

export default app;