import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// ✅ Load environment variables FIRST
dotenv.config();

import connectDB from './config/database.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import profileRoutes from './routes/profile.js';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfRoutes from './routes/pdfRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/assessment', assessmentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Register /api/profiles consistently
app.use('/api/profiles', profileRoutes);
app.use('/api/pdf', pdfRoutes);


console.log('✅ Routes registered: assessment, health, auth, chat, profile(s)');

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Aurevia Health Backend API',
    version: '1.0.0',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
