✅ Complete API Routes List (Formatted as Clean Bullet List)
🔐 Authentication (/api/auth)

POST /api/auth/register — Register new user

POST /api/auth/login — Login user

GET /api/auth/me — Get current user (Protected)

POST /api/auth/logout — Logout user (Protected)

📚 Courses (/api/courses)
Courses

GET /api/courses — Get all courses

POST /api/courses — Create course (Admin)

GET /api/courses/:id — Get single course

PUT /api/courses/:id — Update course (Admin)

DELETE /api/courses/:id — Delete course (Admin)

GET /api/courses/:id/structure — Get course structure

POST /api/courses/:id/enroll — Enroll in course (Protected)

Sections

GET /api/courses/:id/sections — Get course sections

POST /api/courses/:id/sections — Create section (Admin)

PUT /api/courses/sections/:id — Update section (Admin)

DELETE /api/courses/sections/:id — Delete section (Admin)

Lessons

GET /api/courses/sections/:id/lessons — Get section lessons

POST /api/courses/sections/:id/lessons — Create lesson (Admin)

PUT /api/courses/lessons/:id — Update lesson (Admin)

DELETE /api/courses/lessons/:id — Delete lesson (Admin)

Quizzes

GET /api/courses/sections/:id/quiz — Get quiz of a section

POST /api/courses/sections/:id/quiz — Create quiz (Admin)

GET /api/courses/quiz/:id — Get quiz

PUT /api/courses/quiz/:id — Update quiz (Admin)

DELETE /api/courses/quiz/:id — Delete quiz (Admin)

POST /api/courses/quiz/:id/submit — Submit quiz (Protected)

👨‍🎓 Students (/api/students) (Admin Only)

GET /api/students — Get all students

GET /api/students/:id — Get student by ID

PUT /api/students/:id — Update student

DELETE /api/students/:id — Delete student

📝 Blogs (/api/blogs)

GET /api/blogs — Get all blogs

POST /api/blogs — Create blog (Admin)

GET /api/blogs/:id — Get blog by ID

PUT /api/blogs/:id — Update blog (Admin)

DELETE /api/blogs/:id — Delete blog (Admin)

🎥 Live Classes (/api/live-classes)

GET /api/live-classes — Get all live classes

POST /api/live-classes — Create live class (Admin)

GET /api/live-classes/:id — Get live class

PUT /api/live-classes/:id — Update live class (Admin)

DELETE /api/live-classes/:id — Delete live class (Admin)

📊 Progress (/api/progress)

POST /api/progress/lesson/:id/complete — Mark lesson completed (Protected)

GET /api/progress/course/:id — Get course progress (Protected)

🏆 Certificates (/api/certificates) (Protected)

GET /api/certificates — Get all user certificates

GET /api/certificates/status — Get certificate status

GET /api/certificates/:id — Get specific certificate

📈 Analytics (/api/analytics) (Admin Only)

GET /api/analytics/overview — Get system overview

GET /api/analytics/courses — Course analytics

GET /api/analytics/enrollments — Enrollment analytics

📤 Upload (/api/upload)

POST /api/upload/thumbnail — Upload course thumbnail (Admin)

🏥 Health Check

GET /api/health — Server health check

🧮 Total Routes Summary

49 Total Routes

Public: 12

Protected: 8

Admin Only: 29



## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Admin)
- `GET /api/courses/:id` - Get single course
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/sections` - Get course sections
- `POST /api/courses/:id/sections` - Create section (Admin)
- `GET /api/courses/sections/:id/lessons` - Get section lessons
- `POST /api/courses/sections/:id/lessons` - Create lesson (Admin)

### Students
- `GET /api/students` - Get all students (Admin)
- `GET /api/students/:id` - Get single student (Admin)
- `PUT /api/students/:id` - Update student (Admin)
- `DELETE /api/students/:id` - Delete student (Admin)

### Progress
- `POST /api/progress/lesson/:id/complete` - Mark lesson complete
- `GET /api/progress/course/:id` - Get course progress

### Certificates
- `GET /api/certificates` - Get user certificates
- `GET /api/certificates/:id` - Get single certificate
- `GET /api/certificates/status` - Get certificate status for enrolled courses

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog (Admin)
- `GET /api/blogs/:id` - Get single blog
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)

### Live Classes
- `GET /api/live-classes` - Get all live classes
- `POST /api/live-classes` - Create live class (Admin)
- `GET /api/live-classes/:id` - Get single live class
- `PUT /api/live-classes/:id` - Update live class (Admin)
- `DELETE /api/live-classes/:id` - Delete live class (Admin)

### Analytics
- `GET /api/analytics/overview` - Get dashboard overview (Admin)
- `GET /api/analytics/courses` - Get course analytics (Admin)
- `GET /api/analytics/enrollments` - Get enrollment analytics (Admin)
