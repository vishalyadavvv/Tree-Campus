import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import dashboardRoutes from './routes/dashboard.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import liveClassRoutes from './routes/liveClassRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js'
import accountDeletion from './routes/accountDeletion.js';
import registerSchool from'./routes/schoolRegistration.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware


// CORS must be FIRST
app.use(cors({
  origin: ['http://localhost:5173', 'https://treecampus.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH','Options'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Visemes', 'Content-Disposition'],
  credentials: true,
}));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(compression());
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Tree Campus API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/account-deletion-request', accountDeletion);
app.use('/api/registerschool',registerSchool);
app.use('/api/assignments', assignmentRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║       Tree Campus Backend Server                     ║
║                                                      ║
║  ✅ Server running on port ${PORT}                       ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  🔗 API Base URL: http://localhost:${PORT}/api           ║
║  ☁️  Using Cloudinary for media storage              ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;