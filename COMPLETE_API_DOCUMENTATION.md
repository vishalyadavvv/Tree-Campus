# Tree Campus - Complete API Documentation

## Server Configuration
- **Base URL:** `http://localhost:4000` (Development)
- **API Prefix:** `/api`
- **Database:** MongoDB
- **Port:** 4000 (or set via `PORT` environment variable)

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Course APIs](#course-apis)
4. [Quiz APIs](#quiz-apis)
5. [Enrollment APIs](#enrollment-apis)
6. [Progress APIs](#progress-apis)
7. [Certificate APIs](#certificate-apis)
8. [Live Class APIs](#live-class-apis)
9. [Blog APIs](#blog-apis)
10. [Volunteer APIs](#volunteer-apis)
11. [School Registration APIs](#school-registration-apis)
12. [Account Deletion APIs](#account-deletion-apis)
13. [AI Chat APIs](#ai-chat-apis)
14. [Analytics APIs](#analytics-apis)
15. [Student APIs](#student-apis)
16. [Upload APIs](#upload-apis)

---

## Authentication APIs

### Base Endpoint: `/api/auth`

#### 1. User Signup (Register)
- **Method:** `POST`
- **Endpoint:** `/api/auth/signup`
- **Access:** Public
- **Description:** Register a new user with OTP verification
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securePassword123",
  "role": "student"
}
```
- **Response:** 
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email with the OTP sent.",
  "data": {
    "userId": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "9876543210"
  }
}
```

#### 2. Verify OTP
- **Method:** `POST`
- **Endpoint:** `/api/auth/verify-otp`
- **Access:** Public
- **Description:** Verify OTP sent during registration
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": true
    }
  }
}
```

#### 3. Resend OTP
- **Method:** `POST`
- **Endpoint:** `/api/auth/resend-otp`
- **Access:** Public
- **Description:** Resend OTP to email
- **Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### 4. User Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Access:** Public
- **Description:** Login with email and password
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

#### 5. Refresh Token
- **Method:** `POST`
- **Endpoint:** `/api/auth/refresh-token`
- **Access:** Public
- **Description:** Generate new access token using refresh token
- **Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### 6. Forgot Password
- **Method:** `POST`
- **Endpoint:** `/api/auth/forgot-password`
- **Access:** Public
- **Description:** Request password reset email
- **Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### 7. Reset Password
- **Method:** `POST`
- **Endpoint:** `/api/auth/reset-password`
- **Access:** Public
- **Description:** Reset password with token
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "newPassword123"
}
```

#### 8. Get User Profile
- **Method:** `GET`
- **Endpoint:** `/api/auth/profile`
- **Access:** Protected (requires authentication)
- **Description:** Get current user profile
- **Headers:**
```
Authorization: Bearer {accessToken}
```

#### 9. Logout
- **Method:** `POST`
- **Endpoint:** `/api/auth/logout`
- **Access:** Protected
- **Description:** Logout user

---

## User APIs

### Base Endpoint: `/api/users`

#### 1. Get User Profile
- **Method:** `GET`
- **Endpoint:** `/api/users/profile`
- **Access:** Protected
- **Description:** Retrieve current user profile

#### 2. Update User Profile
- **Method:** `PUT`
- **Endpoint:** `/api/users/profile`
- **Access:** Protected
- **Description:** Update user profile information
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "preferredLanguage": "english"
}
```

#### 3. Change Password
- **Method:** `PUT`
- **Endpoint:** `/api/users/change-password`
- **Access:** Protected
- **Description:** Change user password
- **Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

#### 4. Get All Users (Admin Only)
- **Method:** `GET`
- **Endpoint:** `/api/users`
- **Access:** Protected, Admin Only
- **Description:** Get all registered users

#### 5. Get User by ID (Admin Only)
- **Method:** `GET`
- **Endpoint:** `/api/users/{id}`
- **Access:** Protected, Admin Only
- **Description:** Get specific user details

#### 6. Update User Role (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `/api/users/{id}/role`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "role": "admin"
}
```

#### 7. Delete User (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/users/{id}`
- **Access:** Protected, Admin Only
- **Description:** Delete user account

---

## Course APIs

### Base Endpoint: `/api/courses`

#### 1. Get All Courses
- **Method:** `GET`
- **Endpoint:** `/api/courses`
- **Access:** Public
- **Description:** Get all published courses
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `category` - Filter by category
  - `level` - Filter by level

#### 2. Get Course by ID
- **Method:** `GET`
- **Endpoint:** `/api/courses/{id}`
- **Access:** Public
- **Description:** Get specific course details

#### 3. Create Course (Admin Only)
- **Method:** `POST`
- **Endpoint:** `/api/courses`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "title": "Spoken English Basics",
  "description": "Learn spoken English from scratch",
  "category": "Speaking",
  "level": "Beginner",
  "language": "english",
  "duration": "8 weeks",
  "price": 999,
  "thumbnail": "url_to_thumbnail"
}
```

#### 4. Update Course (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `/api/courses/{id}`
- **Access:** Protected, Admin Only

#### 5. Delete Course (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/courses/{id}`
- **Access:** Protected, Admin Only

#### 6. Get Course Structure
- **Method:** `GET`
- **Endpoint:** `/api/courses/{id}/structure`
- **Access:** Public
- **Description:** Get course sections and lessons structure

#### 7. Upload Course Thumbnail
- **Method:** `POST`
- **Endpoint:** `/api/courses/{id}/thumbnail`
- **Access:** Protected, Admin Only
- **Description:** Upload course thumbnail image
- **Headers:**
```
Content-Type: multipart/form-data
```

### Sections

#### 1. Get Course Sections
- **Method:** `GET`
- **Endpoint:** `/api/courses/{id}/sections`
- **Access:** Public

#### 2. Create Section (Admin Only)
- **Method:** `POST`
- **Endpoint:** `/api/courses/{id}/sections`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "title": "Introduction",
  "description": "Getting started"
}
```

#### 3. Update Section (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `/api/courses/sections/{sectionId}`
- **Access:** Protected, Admin Only

#### 4. Delete Section (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/courses/sections/{sectionId}`
- **Access:** Protected, Admin Only

### Lessons

#### 1. Get Section Lessons
- **Method:** `GET`
- **Endpoint:** `/api/courses/sections/{sectionId}/lessons`
- **Access:** Public

#### 2. Create Lesson (Admin Only)
- **Method:** `POST`
- **Endpoint:** `/api/courses/sections/{sectionId}/lessons`
- **Access:** Protected, Admin Only
- **Headers:** `Content-Type: multipart/form-data`
- **Request Body (Form Data):**
```
title: "Lesson 1: Greetings"
videoUrl: "https://youtube.com/watch?v=..."
duration: "15 mins"
textContent: "Text content here"
pdf: [PDF file]
```

#### 3. Update Lesson (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `/api/courses/lessons/{lessonId}`
- **Access:** Protected, Admin Only

#### 4. Delete Lesson (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/courses/lessons/{lessonId}`
- **Access:** Protected, Admin Only

### Enrollment

#### 1. Enroll in Course
- **Method:** `POST`
- **Endpoint:** `/api/courses/{id}/enroll`
- **Access:** Protected
- **Description:** Enroll current user in course

#### 2. Check Enrollment Status
- **Method:** `GET`
- **Endpoint:** `/api/courses/{id}/enrollment-status`
- **Access:** Protected
- **Description:** Check if user is enrolled in course

---

## Quiz APIs

### Base Endpoint: `/api/quizzes`

#### 1. Get Quiz by Lesson
- **Method:** `GET`
- **Endpoint:** `/api/quizzes/lesson/{lessonId}`
- **Access:** Protected
- **Description:** Get quiz for specific lesson

#### 2. Get Section Quizzes
- **Method:** `GET`
- **Endpoint:** `/api/quizzes/section/{sectionId}`
- **Access:** Protected
- **Description:** Get all quizzes in a section

#### 3. Get Quiz Details
- **Method:** `GET`
- **Endpoint:** `/api/quizzes/{id}`
- **Access:** Protected

#### 4. Create Quiz (Admin Only)
- **Method:** `POST`
- **Endpoint:** `/api/quizzes`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "title": "Quiz 1",
  "description": "Test your knowledge",
  "sectionId": "section_id",
  "questions": [
    {
      "questionText": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "points": 1
    }
  ],
  "passingScore": 70,
  "timeLimit": 30
}
```

#### 5. Update Quiz (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `/api/quizzes/{id}`
- **Access:** Protected, Admin Only

#### 6. Delete Quiz (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/quizzes/{id}`
- **Access:** Protected, Admin Only

#### 7. Submit Quiz
- **Method:** `POST`
- **Endpoint:** `/api/quizzes/{id}/submit`
- **Access:** Protected
- **Request Body:**
```json
{
  "answers": [0, 1, 2, 1]
}
```

---

## Enrollment APIs

### Base Endpoint: `/api/enrollments`

#### 1. Check Enrollment
- **Method:** `GET`
- **Endpoint:** `/api/enrollments/check/{courseId}`
- **Access:** Protected

#### 2. Get My Enrollments
- **Method:** `GET`
- **Endpoint:** `/api/enrollments/my-courses`
- **Access:** Protected
- **Description:** Get all courses enrolled by current user

#### 3. Get Enrollment Details
- **Method:** `GET`
- **Endpoint:** `/api/enrollments/{id}`
- **Access:** Protected

#### 4. Enroll in Course
- **Method:** `POST`
- **Endpoint:** `/api/enrollments`
- **Access:** Protected
- **Request Body:**
```json
{
  "courseId": "course_id"
}
```

#### 5. Update Enrollment Progress
- **Method:** `PUT`
- **Endpoint:** `/api/enrollments/{id}/progress`
- **Access:** Protected

#### 6. Delete Enrollment
- **Method:** `DELETE`
- **Endpoint:** `/api/enrollments/{id}`
- **Access:** Protected

---

## Progress APIs

### Base Endpoint: `/api/progress`

#### 1. Mark Lesson as Complete
- **Method:** `POST`
- **Endpoint:** `/api/progress/lesson/{lessonId}/complete`
- **Access:** Protected
- **Description:** Mark lesson as completed

#### 2. Get Course Progress
- **Method:** `GET`
- **Endpoint:** `/api/progress/course/{courseId}`
- **Access:** Protected
- **Description:** Get overall progress in a course

---

## Certificate APIs

### Base Endpoint: `/api/certificates`

#### 1. Get All Certificates
- **Method:** `GET`
- **Endpoint:** `/api/certificates`
- **Access:** Protected
- **Description:** Get all certificates for current user

#### 2. Get Certificate by ID
- **Method:** `GET`
- **Endpoint:** `/api/certificates/{id}`
- **Access:** Protected

#### 3. Get Certificate Status
- **Method:** `GET`
- **Endpoint:** `/api/certificates/status`
- **Access:** Protected
- **Description:** Check certificate eligibility status

---

## Live Class APIs

### Base Endpoint: `/api/live-classes`

#### 1. Get All Live Classes
- **Method:** `GET`
- **Endpoint:** `/api/live-classes`
- **Access:** Public

#### 2. Get Live Class by ID
- **Method:** `GET`
- **Endpoint:** `/api/live-classes/{id}`
- **Access:** Public

#### 3. Create Live Class (Admin Only)
- **Method:** `POST`
- **Endpoint:** `/api/live-classes`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "title": "Live Class",
  "description": "Description",
  "startTime": "2025-12-10T10:00:00Z",
  "endTime": "2025-12-10T11:00:00Z",
  "meetingLink": "https://zoom.us/...",
  "instructor": "instructor_id"
}
```

#### 4. Update Live Class (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `/api/live-classes/{id}`
- **Access:** Protected, Admin Only

#### 5. Delete Live Class (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/live-classes/{id}`
- **Access:** Protected, Admin Only

---

## Blog APIs

### Base Endpoint: `/api/blogs`

#### 1. Get All Blogs
- **Method:** `GET`
- **Endpoint:** `/api/blogs`
- **Access:** Public

#### 2. Get Blog by ID
- **Method:** `GET`
- **Endpoint:** `/api/blogs/{id}`
- **Access:** Public

#### 3. Create Blog (Admin Only)
- **Method:** `POST`
- **Endpoint:** `/api/blogs`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "title": "Blog Title",
  "content": "Blog content here",
  "author": "Author Name",
  "category": "Category",
  "tags": ["tag1", "tag2"]
}
```

#### 4. Update Blog (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `/api/blogs/{id}`
- **Access:** Protected, Admin Only

#### 5. Delete Blog (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/blogs/{id}`
- **Access:** Protected, Admin Only

---

## Volunteer APIs

### Base Endpoint: `/api/volunteer`

#### 1. Submit Volunteer Application
- **Method:** `POST`
- **Endpoint:** `/api/volunteer`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "motivation": "I want to help students learn English"
}
```

#### 2. Verify Volunteer OTP
- **Method:** `POST`
- **Endpoint:** `/api/volunteer/verify-otp`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### 3. Get All Volunteers
- **Method:** `GET`
- **Endpoint:** `/api/volunteer`
- **Access:** Public

#### 4. Get Volunteer by ID
- **Method:** `GET`
- **Endpoint:** `/api/volunteer/{id}`
- **Access:** Public

#### 5. Update Volunteer Status (Admin Only)
- **Method:** `PATCH`
- **Endpoint:** `/api/volunteer/{id}/status`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "status": "approved"
}
```

#### 6. Delete Volunteer
- **Method:** `DELETE`
- **Endpoint:** `/api/volunteer/{id}`
- **Access:** Public

---

## School Registration APIs

### Base Endpoint: `/api/registerschool`

#### 1. Submit School Registration
- **Method:** `POST`
- **Endpoint:** `/api/registerschool`
- **Access:** Public
- **Request Body:**
```json
{
  "schoolName": "ABC Public School",
  "schoolEmail": "school@example.com",
  "schoolAddress": "456 School Lane",
  "schoolPhone": "1122334455",
  "contactPersonName": "Mr. Principal",
  "contactPersonEmail": "principal@example.com",
  "contactPersonPhone": "5544332211",
  "termsAccepted": true
}
```

#### 2. Verify School OTP
- **Method:** `POST`
- **Endpoint:** `/api/registerschool/verify-otp`
- **Access:** Public
- **Request Body:**
```json
{
  "schoolEmail": "school@example.com",
  "otp": "123456"
}
```

#### 3. Get All School Registrations
- **Method:** `GET`
- **Endpoint:** `/api/registerschool`
- **Access:** Public

#### 4. Get School Registration by ID
- **Method:** `GET`
- **Endpoint:** `/api/registerschool/{id}`
- **Access:** Public

#### 5. Update School Status (Admin Only)
- **Method:** `PATCH`
- **Endpoint:** `/api/registerschool/{id}/status`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "status": "approved"
}
```

#### 6. Delete School Registration
- **Method:** `DELETE`
- **Endpoint:** `/api/registerschool/{id}`
- **Access:** Public

---

## Account Deletion APIs

### Base Endpoint: `/api/account-deletion-request`

#### 1. Request Account Deletion
- **Method:** `POST`
- **Endpoint:** `/api/account-deletion-request`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "reason": "No longer needed"
}
```

#### 2. Verify Account Deletion OTP
- **Method:** `POST`
- **Endpoint:** `/api/account-deletion-request/verify-otp`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### 3. Verify via Token
- **Method:** `GET`
- **Endpoint:** `/api/account-deletion-request/verify/{token}`
- **Access:** Public

#### 4. Get All Deletion Requests (Admin Only)
- **Method:** `GET`
- **Endpoint:** `/api/account-deletion-request/all`
- **Access:** Protected, Admin Only

#### 5. Get Deletion Request by ID
- **Method:** `GET`
- **Endpoint:** `/api/account-deletion-request/{id}`
- **Access:** Public

#### 6. Update Deletion Status (Admin Only)
- **Method:** `PATCH`
- **Endpoint:** `/api/account-deletion-request/{id}/status`
- **Access:** Protected, Admin Only
- **Request Body:**
```json
{
  "status": "processing"
}
```

#### 7. Cancel Deletion Request
- **Method:** `DELETE`
- **Endpoint:** `/api/account-deletion-request/{id}`
- **Access:** Public

---

## AI Chat APIs

### Base Endpoint: `/api/ai`

#### 1. Ask Question
- **Method:** `POST`
- **Endpoint:** `/api/ai/ask`
- **Access:** Protected
- **Request Body:**
```json
{
  "question": "How do I improve my English?"
}
```

#### 2. Get Chat History
- **Method:** `GET`
- **Endpoint:** `/api/ai/history`
- **Access:** Protected

#### 3. Get Conversation
- **Method:** `GET`
- **Endpoint:** `/api/ai/conversation/{id}`
- **Access:** Protected

#### 4. Delete Conversation
- **Method:** `DELETE`
- **Endpoint:** `/api/ai/conversation/{id}`
- **Access:** Protected

---

## Analytics APIs

### Base Endpoint: `/api/analytics`
All endpoints require: Protected, Admin Only

#### 1. Get Overview
- **Method:** `GET`
- **Endpoint:** `/api/analytics/overview`
- **Description:** Get overall platform analytics

#### 2. Get Course Analytics
- **Method:** `GET`
- **Endpoint:** `/api/analytics/courses`
- **Description:** Get analytics for all courses

#### 3. Get Enrollment Analytics
- **Method:** `GET`
- **Endpoint:** `/api/analytics/enrollments`
- **Description:** Get enrollment statistics

---

## Student APIs

### Base Endpoint: `/api/students`

#### 1. Get Student Dashboard
- **Method:** `GET`
- **Endpoint:** `/api/students/dashboard`
- **Access:** Protected
- **Description:** Get current user's dashboard

#### 2. Get All Students (Admin Only)
- **Method:** `GET`
- **Endpoint:** `/api/students`
- **Access:** Protected, Admin Only

#### 3. Get Student by ID (Admin Only)
- **Method:** `GET`
- **Endpoint:** `/api/students/{id}`
- **Access:** Protected, Admin Only

#### 4. Update Student (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `/api/students/{id}`
- **Access:** Protected, Admin Only

#### 5. Delete Student (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `/api/students/{id}`
- **Access:** Protected, Admin Only

---

## Upload APIs

### Base Endpoint: `/api/upload`

#### 1. Upload Course Thumbnail
- **Method:** `POST`
- **Endpoint:** `/api/upload`
- **Access:** Protected, Admin Only
- **Headers:** `Content-Type: multipart/form-data`
- **Description:** Upload image/document

---

## Dashboard APIs

### Base Endpoint: `/api/dashboard`

#### 1. Get Dashboard Data
- **Method:** `GET`
- **Endpoint:** `/api/dashboard`
- **Access:** Public
- **Description:** Get dashboard mock data

---

## General Endpoints

### Health Check
- **Endpoint:** `/api/health`
- **Method:** `GET`
- **Description:** Check if API is running
- **Response:**
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 3600.45,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

### Root Endpoint
- **Endpoint:** `/`
- **Method:** `GET`
- **Description:** API welcome message

---

## Authentication & Authorization

### Access Levels
1. **Public** - No authentication required
2. **Protected** - Requires valid JWT token
3. **Admin Only** - Requires JWT token + admin role

### Authentication Header
```
Authorization: Bearer {accessToken}
```

### Token Storage (Frontend)
- **Access Token:** localStorage or sessionStorage (expires in 1 hour)
- **Refresh Token:** localStorage or httpOnly cookie (expires in 7 days)

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": ["Additional error details"]
}
```

### Common Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting & Security

- **CORS:** Enabled for `localhost:5173` and `localhost:5174`
- **Rate Limiting:** Recommended to implement per endpoint
- **HTTPS:** Required in production
- **API Timeout:** 30 seconds recommended
- **Payload Size:** Max 10MB for uploads

---

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "...",
    "name": "...",
    "...": "..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Operation failed",
  "statusCode": 400,
  "errors": ["Error 1", "Error 2"]
}
```

---

## Usage Examples

### Example 1: Register and Verify
```bash
# 1. Register
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123",
    "role": "student"
  }'

# 2. Verify OTP
curl -X POST http://localhost:4000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

### Example 2: Create and Enroll Course
```bash
# 1. Create Course (Admin)
curl -X POST http://localhost:4000/api/courses \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "English Basics",
    "description": "Learn English",
    "category": "Speaking"
  }'

# 2. Enroll in Course (Student)
curl -X POST http://localhost:4000/api/courses/{courseId}/enroll \
  -H "Authorization: Bearer {accessToken}"
```

---

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Solution: Check if token is valid and not expired

2. **403 Forbidden**
   - Solution: User doesn't have required admin role

3. **404 Not Found**
   - Solution: Check endpoint URL and resource ID

4. **CORS Error**
   - Solution: Ensure frontend URL is in CORS whitelist

5. **OTP Not Received**
   - Solution: Check email configuration in .env

---

## Future Enhancements

- [ ] Add pagination to list endpoints
- [ ] Implement API rate limiting
- [ ] Add webhook support
- [ ] Implement GraphQL API
- [ ] Add API versioning
- [ ] Create SDK for client libraries
- [ ] Add automated API tests
- [ ] Implement caching layer

---

## Support & Documentation

For issues or questions:
1. Check error message details
2. Review request/response format
3. Verify authentication token
4. Check database connection
5. Review server logs

**Last Updated:** December 7, 2025
**API Version:** 1.0.0
