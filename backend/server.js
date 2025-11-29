  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');
  const compression = require('compression');
  const rateLimit = require('express-rate-limit');
  const connectDB = require('./config/db');
  const { errorHandler, notFound } = require('./middleware/errorHandler');
const dashboardRoutes = require("./routes/dashboard");

  // Initialize Express app
  const app = express();

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(helmet()); // Security headers
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173  ',
    credentials: true,
  }));
  app.use(compression()); // Compress responses
  app.use(morgan('dev')); // Logging
  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });

  app.use('/api/', limiter);

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
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/courses', require('./routes/courseRoutes'));
  app.use('/api/quizzes', require('./routes/quizRoutes'));
  app.use('/api/progress', require('./routes/progressRoutes'));
  app.use('/api/ai', require('./routes/aiRoutes'));
  app.use('/api/live-classes', require('./routes/liveClassRoutes'));
  app.use("/api/dashboard", dashboardRoutes);

  // 404 handler
  app.use(notFound);

  // Error handler (must be last)
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT || 4000;

  const server = app.listen(PORT, () => {
    console.log(`
  Tree Campus Backend Server 
    Server running on port ${PORT}                       
    Environment: ${process.env.NODE_ENV || 'development'}                      ║
    API Base URL: http://localhost:${PORT}/api           
                                                        
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

  module.exports = app;
