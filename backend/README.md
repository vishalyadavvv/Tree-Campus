# Tree Campus Backend API

A comprehensive backend API for the Tree Campus learning platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication System**: JWT-based auth with signup, login, OTP verification, password reset
- **Course Management**: Create, edit, delete courses with lessons and quizzes
- **AI Assistant**: OpenAI-powered learning assistant with conversation history
- **Progress Tracking**: Track lesson completion, quiz scores, and generate certificates
- **Live Classes**: Schedule and manage live classes (Zoom/YouTube integration)
- **User Management**: Profile management and admin controls
- **File Uploads**: Cloudinary integration for videos and images
- **Security**: Helmet, CORS, rate limiting, input validation, password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)
- OpenAI API key (for AI assistant)
- Email service (Gmail, SendGrid, etc.)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory (use `.env.example` as template):
   ```env
   # Server
   PORT=4000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/tree-campus
   
   # JWT
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_ACCESS_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   
   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # OpenAI
   OPENAI_API_KEY=your_openai_key
   
   # Frontend
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:400/api
```

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "newPassword": "newpassword123"
}
```

### Course Endpoints

#### Get All Courses
```http
GET /api/courses?category=Programming&level=Beginner&page=1&limit=10
```

#### Get Course by ID
```http
GET /api/courses/:id
```

#### Create Course (Instructor/Admin)
```http
POST /api/courses
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Introduction to JavaScript",
  "description": "Learn JavaScript from scratch",
  "category": "Programming",
  "level": "Beginner",
  "tags": ["javascript", "web development"]
}
```

#### Upload Course Thumbnail
```http
POST /api/courses/:id/thumbnail
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

thumbnail: [image file]
```

#### Enroll in Course
```http
POST /api/courses/:id/enroll
Authorization: Bearer {access_token}
```

#### Create Lesson
```http
POST /api/courses/:id/lessons
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Variables and Data Types",
  "description": "Learn about JavaScript variables",
  "duration": 30,
  "order": 1
}
```

#### Upload Lesson Video
```http
POST /api/courses/lessons/:lessonId/video
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

video: [video file]
```

### Quiz Endpoints

#### Create Quiz
```http
POST /api/quizzes
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "lessonId": "lesson_id",
  "title": "Variables Quiz",
  "questions": [
    {
      "question": "What is a variable?",
      "options": ["A container", "A function", "A loop", "A condition"],
      "correctAnswer": 0,
      "explanation": "Variables are containers for storing data"
    }
  ],
  "passingScore": 70
}
```

#### Submit Quiz
```http
POST /api/quizzes/:id/submit
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "answers": [0, 2, 1, 3]
}
```

### Progress Endpoints

#### Mark Lesson Complete
```http
POST /api/progress/lesson/:lessonId/complete
Authorization: Bearer {access_token}
```

#### Get Course Progress
```http
GET /api/progress/course/:courseId
Authorization: Bearer {access_token}
```

#### Get User Analytics
```http
GET /api/progress/analytics
Authorization: Bearer {access_token}
```

#### Issue Certificate
```http
POST /api/progress/course/:courseId/certificate
Authorization: Bearer {access_token}
```

### AI Assistant Endpoints

#### Ask Question
```http
POST /api/ai/ask
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "question": "What is a closure in JavaScript?",
  "courseId": "optional_course_id",
  "lessonId": "optional_lesson_id",
  "conversationId": "optional_conversation_id"
}
```

#### Get Chat History
```http
GET /api/ai/history?page=1&limit=10
Authorization: Bearer {access_token}
```

### Live Class Endpoints

#### Create Live Class
```http
POST /api/live-classes
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "JavaScript Masterclass",
  "description": "Live coding session",
  "courseId": "optional_course_id",
  "scheduledTime": "2024-12-01T10:00:00Z",
  "duration": 60,
  "platform": "Zoom",
  "meetingLink": "https://zoom.us/j/123456789",
  "meetingId": "123 456 789",
  "passcode": "abc123"
}
```

#### Join Live Class
```http
POST /api/live-classes/:id/join
Authorization: Bearer {access_token}
```

### User Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer {access_token}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "John Updated",
  "profilePicture": "https://..."
}
```

#### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

## 🔒 Security Features

- **JWT Authentication**: Access and refresh tokens
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Express-validator for all inputs
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Email Verification**: OTP-based verification

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary config
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── quizController.js
│   ├── progressController.js
│   ├── aiController.js
│   ├── liveClassController.js
│   └── userController.js
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Lesson.js
│   ├── Quiz.js
│   ├── Progress.js
│   ├── Certificate.js
│   ├── ChatHistory.js
│   └── LiveClass.js
├── routes/
│   ├── authRoutes.js
│   ├── courseRoutes.js
│   ├── quizRoutes.js
│   ├── progressRoutes.js
│   ├── aiRoutes.js
│   ├── liveClassRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── errorHandler.js    # Global error handler
│   ├── upload.js          # Multer/Cloudinary
│   └── validate.js        # Input validation
├── utils/
│   ├── generateToken.js   # JWT utilities
│   ├── sendEmail.js       # Email service
│   ├── openai.js          # OpenAI integration
│   └── generateCertificate.js
├── .env.example
├── .gitignore
├── package.json
└── server.js              # Main entry point
```

## 🧪 Testing

Use the provided Postman collection or test with curl:

```bash
# Health check
curl http://localhost:4000/api/health

# Signup
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

## 🚀 Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use MongoDB Atlas for production database
3. Configure production email service
4. Set up proper CORS origins
5. Use environment-specific secrets for JWT

## 📝 License

ISC

## 👥 Support

For issues or questions, contact the development team.

---

Built with ❤️ for Tree Campus Learning Platform
