# API Documentation

Complete API reference for the Admin Dashboard backend.

## Table of Contents
- [Base Configuration](#base-configuration)
- [Authentication](#authentication)
- [Courses](#courses)
- [Students](#students)
- [Blogs](#blogs)
- [Live Classes](#live-classes)
- [Progress Tracking](#progress-tracking)
- [Certificates](#certificates)
- [Analytics](#analytics)
- [File Upload](#file-upload)
- [API Usage Mapping](#api-usage-mapping)
- [Missing Implementations](#missing-implementations)

---

## Base Configuration

**Base URL:** `http://localhost:4000/api`

**CORS:** Enabled for `http://localhost:5174`

**Authentication:** JWT tokens via cookies

### Access Levels
- 🌐 **Public** - No authentication required
- 🔒 **Protected** - Requires valid JWT token (any logged-in user)
- 👑 **Admin Only** - Requires valid JWT token + admin role

---

## Authentication

**Base Path:** `/api/auth`

### Register User
```http
POST /api/auth/register
```
**Access:** 🌐 Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone.no":"78889689",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

**Frontend Usage:** `AuthContext.jsx`

---

### Login User
```http
POST /api/auth/login
```
**Access:** 🌐 Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

**Frontend Usage:** `AuthContext.jsx`

---

### Get Current User
```http
GET /api/auth/me
```
**Access:** 🔒 Protected

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

**Frontend Usage:** `AuthContext.jsx`

---

### Logout User
```http
POST /api/auth/logout
```
**Access:** 🔒 Protected

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Frontend Usage:** `AuthContext.jsx`

---

## Courses

**Base Path:** `/api/courses`

### Get All Courses
```http
GET /api/courses
```
**Access:** 🌐 Public

**Frontend Usage:** `CourseCatalog.jsx`, `CoursesManagement.jsx`

---

### Create Course
```http
POST /api/courses
```
**Access:** 👑 Admin Only

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn JavaScript from scratch",
  "instructor": "John Doe",
  "price": 49.99,
  "thumbnail": "/uploads/thumbnails/course.jpg",
  "level": "Beginner",
  "duration": "10 hours"
}
```

**Frontend Usage:** `CoursesManagement.jsx`

---

### Get Single Course
```http
GET /api/courses/:id
```
**Access:** 🌐 Public

**Frontend Usage:** `CertificateView.jsx`

---

### Update Course
```http
PUT /api/courses/:id
```
**Access:** 👑 Admin Only

**Status:** ❌ **NOT IMPLEMENTED IN FRONTEND**

**Recommendation:** Add edit functionality to `CoursesManagement.jsx`

---

### Delete Course
```http
DELETE /api/courses/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `CoursesManagement.jsx`

---

### Get Course Structure
```http
GET /api/courses/:id/structure
```
**Access:** 🌐 Public

**Response:** Complete course with all sections, lessons, and quizzes

**Frontend Usage:** `CourseBuilder.jsx`, `CourseOverview.jsx`

---

### Enroll in Course
```http
POST /api/courses/:id/enroll
```
**Access:** 🔒 Protected

**Frontend Usage:** `CourseCatalog.jsx`

---

### Sections

#### Get Course Sections
```http
GET /api/courses/:id/sections
```
**Access:** 🌐 Public

**Frontend Usage:** `LessonView.jsx`

---

#### Create Section
```http
POST /api/courses/:id/sections
```
**Access:** 👑 Admin Only

**Request Body:**
```json
{
  "title": "Introduction",
  "description": "Getting started with the course",
  "order": 0
}
```

**Frontend Usage:** `CourseBuilder.jsx`

---

#### Update Section
```http
PUT /api/courses/sections/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `CourseBuilder.jsx`

---

#### Delete Section
```http
DELETE /api/courses/sections/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `CourseBuilder.jsx`

---

### Lessons

#### Get Section Lessons
```http
GET /api/courses/sections/:id/lessons
```
**Access:** 🌐 Public

**Frontend Usage:** `LessonView.jsx`

---

#### Create Lesson
```http
POST /api/courses/sections/:id/lessons
```
**Access:** 👑 Admin Only

**Request Body:**
```json
{
  "title": "Variables and Data Types",
  "videoUrl": "https://youtube.com/watch?v=...",
  "duration": "10:30",
  "description": "Learn about variables",
  "order": 0
}
```

**Frontend Usage:** `CourseBuilder.jsx`

---

#### Update Lesson
```http
PUT /api/courses/lessons/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `CourseBuilder.jsx`

---

#### Delete Lesson
```http
DELETE /api/courses/lessons/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `CourseBuilder.jsx`

---

### Quizzes

#### Get Section Quiz
```http
GET /api/courses/sections/:id/quiz
```
**Access:** 🌐 Public

**Frontend Usage:** `QuizViewer.jsx`

---

#### Create Quiz
```http
POST /api/courses/sections/:id/quiz
```
**Access:** 👑 Admin Only

**Request Body:**
```json
{
  "title": "Section 1 Quiz",
  "description": "Test your knowledge",
  "passingScore": 70,
  "questions": [
    {
      "questionText": "What is JavaScript?",
      "options": [
        { "optionText": "A programming language", "isCorrect": true },
        { "optionText": "A database", "isCorrect": false },
        { "optionText": "An OS", "isCorrect": false },
        { "optionText": "A framework", "isCorrect": false }
      ],
      "points": 1,
      "explanation": "JavaScript is a programming language"
    }
  ]
}
```

**Frontend Usage:** `CourseBuilder.jsx`

---

#### Get Quiz by ID
```http
GET /api/courses/quiz/:id
```
**Access:** 🌐 Public

**Status:** ❌ **NOT IMPLEMENTED IN FRONTEND**

---

#### Update Quiz
```http
PUT /api/courses/quiz/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `CourseBuilder.jsx`

---

#### Delete Quiz
```http
DELETE /api/courses/quiz/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `CourseBuilder.jsx`

---

#### Submit Quiz
```http
POST /api/courses/quiz/:id/submit
```
**Access:** 🔒 Protected

**Request Body:**
```json
{
  "answers": [
    { "questionId": "...", "selectedOption": 0 }
  ]
}
```

**Frontend Usage:** `QuizViewer.jsx`

---

## Students

**Base Path:** `/api/students`

### Get All Students
```http
GET /api/students
```
**Access:** 👑 Admin Only

**Frontend Usage:** `StudentBoard.jsx`

---

### Get Single Student
```http
GET /api/students/:id
```
**Access:** 👑 Admin Only

**Status:** ❌ **NOT IMPLEMENTED IN FRONTEND**

**Recommendation:** Create student detail page

---

### Update Student
```http
PUT /api/students/:id
```
**Access:** 👑 Admin Only

**Status:** ❌ **NOT IMPLEMENTED IN FRONTEND**

**Recommendation:** Add edit functionality to `StudentBoard.jsx`

---

### Delete Student
```http
DELETE /api/students/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `StudentBoard.jsx`

---

## Blogs

**Base Path:** `/api/blogs`

### Get All Blogs
```http
GET /api/blogs
```
**Access:** 🌐 Public

**Frontend Usage:** `BlogList.jsx`, `BlogManagement.jsx`

---

### Create Blog
```http
POST /api/blogs
```
**Access:** 👑 Admin Only

**Request Body:**
```json
{
  "title": "Getting Started with React",
  "content": "Blog content here...",
  "author": "John Doe",
  "thumbnail": "/uploads/thumbnails/blog.jpg",
  "tags": ["react", "javascript"],
  "status": "published"
}
```

**Frontend Usage:** `BlogManagement.jsx`

---

### Get Single Blog
```http
GET /api/blogs/:id
```
**Access:** 🌐 Public

**Frontend Usage:** `BlogPost.jsx`

---

### Update Blog
```http
PUT /api/blogs/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `BlogManagement.jsx`

---

### Delete Blog
```http
DELETE /api/blogs/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `BlogManagement.jsx`

---

## Live Classes

**Base Path:** `/api/live-classes`

### Get All Live Classes
```http
GET /api/live-classes
```
**Access:** 🌐 Public

**Frontend Usage:** `LiveClasses.jsx`, `LiveClassManagement.jsx`

---

### Create Live Class
```http
POST /api/live-classes
```
**Access:** 👑 Admin Only

**Request Body:**
```json
{
  "title": "React Masterclass",
  "instructor": "John Doe",
  "scheduledAt": "2024-12-01T10:00:00Z",
  "duration": "2 hours",
  "meetingLink": "https://zoom.us/j/...",
  "description": "Advanced React concepts"
}
```

**Frontend Usage:** `LiveClassManagement.jsx`

---

### Get Single Live Class
```http
GET /api/live-classes/:id
```
**Access:** 🌐 Public

**Status:** ❌ **NOT IMPLEMENTED IN FRONTEND**

**Recommendation:** Create live class detail page

---

### Update Live Class
```http
PUT /api/live-classes/:id
```
**Access:** 👑 Admin Only

**Status:** ❌ **NOT IMPLEMENTED IN FRONTEND**

**Recommendation:** Add edit functionality to `LiveClassManagement.jsx`

---

### Delete Live Class
```http
DELETE /api/live-classes/:id
```
**Access:** 👑 Admin Only

**Frontend Usage:** `LiveClassManagement.jsx`

---

## Progress Tracking

**Base Path:** `/api/progress`

### Mark Lesson Complete
```http
POST /api/progress/lesson/:id/complete
```
**Access:** 🔒 Protected

**Frontend Usage:** `LessonView.jsx`

---

### Get Course Progress
```http
GET /api/progress/course/:id
```
**Access:** 🔒 Protected

**Response:**
```json
{
  "success": true,
  "data": {
    "completedLessons": ["lesson_id_1", "lesson_id_2"],
    "progress": 45
  }
}
```

**Frontend Usage:** `LessonView.jsx`

---

## Certificates

**Base Path:** `/api/certificates`

### Get All User Certificates
```http
GET /api/certificates
```
**Access:** 🔒 Protected

**Frontend Usage:** `Certificates.jsx`

---

### Get Certificate Status
```http
GET /api/certificates/status
```
**Access:** 🔒 Protected

**Frontend Usage:** `Certificates.jsx`

---

### Get Single Certificate
```http
GET /api/certificates/:id
```
**Access:** 🔒 Protected

**Frontend Usage:** `CertificateView.jsx`

---

## Analytics

**Base Path:** `/api/analytics`

All analytics routes require **👑 Admin Only** access.

### Get Overview Analytics
```http
GET /api/analytics/overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "totalCourses": 12,
    "totalRevenue": 5000,
    "activeEnrollments": 200
  }
}
```

**Frontend Usage:** `Dashboard.jsx`

---

### Get Course Analytics
```http
GET /api/analytics/courses
```

**Frontend Usage:** `Analytics.jsx`

---

### Get Enrollment Analytics
```http
GET /api/analytics/enrollments
```

**Frontend Usage:** `Analytics.jsx`

---

## File Upload

**Base Path:** `/api/upload`

### Upload Thumbnail
```http
POST /api/upload/thumbnail
```
**Access:** 👑 Admin Only

**Content-Type:** `multipart/form-data`

**Form Field:** `thumbnail`

**Accepted Formats:** jpg, jpeg, png, gif, webp

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "thumbnail-1234567890.jpg",
    "url": "/uploads/thumbnails/thumbnail-1234567890.jpg",
    "path": "uploads/thumbnails/thumbnail-1234567890.jpg"
  }
}
```

**Frontend Usage:** `BlogManagement.jsx`, `CoursesManagement.jsx`

---

## API Usage Mapping

### Summary Statistics
- **Total APIs:** 49
- **Used APIs:** 40 (82%)
- **Unused APIs:** 9 (18%)

### Coverage by Category
| Category | Coverage | Status |
|----------|----------|--------|
| Authentication | 4/4 (100%) | ✅ Complete |
| Blogs | 5/5 (100%) | ✅ Complete |
| Progress | 2/2 (100%) | ✅ Complete |
| Certificates | 3/3 (100%) | ✅ Complete |
| Analytics | 3/3 (100%) | ✅ Complete |
| Upload | 1/1 (100%) | ✅ Complete |
| Courses | 18/20 (90%) | ⚠️ Mostly Complete |
| Live Classes | 3/5 (60%) | ⚠️ Partial |
| Students | 2/4 (50%) | ⚠️ Partial |

---

## Missing Implementations

### High Priority

#### 1. Edit Course Functionality
**API:** `PUT /api/courses/:id`  
**Location:** `CoursesManagement.jsx`  
**Feature:** Add edit modal to update course details

#### 2. Edit Live Class Functionality
**API:** `PUT /api/live-classes/:id`  
**Location:** `LiveClassManagement.jsx`  
**Feature:** Add edit modal to reschedule or update live class details

#### 3. Edit Student Functionality
**API:** `PUT /api/students/:id`  
**Location:** `StudentBoard.jsx`  
**Feature:** Add edit modal to update student information

### Medium Priority

#### 4. Student Detail Page
**API:** `GET /api/students/:id`  
**Location:** Create new `StudentDetail.jsx`  
**Feature:** View detailed student profile, enrolled courses, progress

#### 5. Live Class Detail Page
**API:** `GET /api/live-classes/:id`  
**Location:** Create new `LiveClassDetail.jsx`  
**Feature:** View detailed live class information, attendees

#### 6. Quiz Detail View
**API:** `GET /api/courses/quiz/:id`  
**Location:** `QuizViewer.jsx` or new page  
**Feature:** View quiz independently without section context

---

## Frontend Files Reference

### Admin Pages
- `Dashboard.jsx` - Analytics overview
- `Analytics.jsx` - Detailed analytics
- `CoursesManagement.jsx` - Course CRUD
- `CourseBuilder.jsx` - Course content builder
- `BlogManagement.jsx` - Blog CRUD
- `LiveClassManagement.jsx` - Live class CRUD
- `StudentBoard.jsx` - Student management

### Student Pages
- `CourseCatalog.jsx` - Browse courses
- `CourseOverview.jsx` - View course details
- `LessonView.jsx` - Watch lessons
- `QuizViewer.jsx` - Take quizzes
- `BlogList.jsx` - Browse blogs
- `BlogPost.jsx` - Read blog posts
- `LiveClasses.jsx` - View live classes
- `Certificates.jsx` - View certificates
- `CertificateView.jsx` - View single certificate

### Context
- `AuthContext.jsx` - Authentication management

---

## Health Check

```http
GET /api/health
```
**Access:** 🌐 Public

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Admin only routes)
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

1. All protected routes require the `Authorization` header with a Bearer token
2. Admin routes check for `role: 'admin'` in the user object
3. Static files are served from `/uploads` directory
4. CORS is enabled for `http://localhost:5174`
5. Cookies are used for authentication with `credentials: true`
6. All timestamps are in ISO 8601 format
7. File uploads are limited to 5MB per file
