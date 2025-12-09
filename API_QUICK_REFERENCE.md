# Tree Campus - API Quick Reference Guide

## Server & Base URL
```
Base URL: http://localhost:4000, https://tree-campus.onrender.com/
API Prefix: /api
Port: 4000
```

---

## All Endpoints Summary

### 📝 AUTHENTICATION (/api/auth)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/signup` | Public | Register new user with OTP |
| POST | `/verify-otp` | Public | Verify OTP after registration |
| POST | `/resend-otp` | Public | Resend OTP |
| POST | `/login` | Public | User login |
| POST | `/refresh-token` | Public | Refresh access token |
| POST | `/forgot-password` | Public | Request password reset |
| POST | `/reset-password` | Public | Reset password |
| GET | `/profile` | Protected | Get user profile |
| POST | `/logout` | Protected | Logout user |

### 👤 USERS (/api/users)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/profile` | Protected | Get user profile |
| PUT | `/profile` | Protected | Update profile |
| PUT | `/change-password` | Protected | Change password |
| GET | `/` | Protected, Admin | Get all users |
| GET | `/{id}` | Protected, Admin | Get user by ID |
| PUT | `/{id}/role` | Protected, Admin | Update user role |
| DELETE | `/{id}` | Protected, Admin | Delete user |

### 📚 COURSES (/api/courses)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/` | Public | Get all courses |
| POST | `/` | Protected, Admin | Create course |
| GET | `/{id}` | Public | Get course details |
| PUT | `/{id}` | Protected, Admin | Update course |
| DELETE | `/{id}` | Protected, Admin | Delete course |
| GET | `/{id}/structure` | Public | Get course structure |
| POST | `/{id}/thumbnail` | Protected, Admin | Upload thumbnail |
| POST | `/{id}/enroll` | Protected | Enroll in course |
| GET | `/{id}/enrollment-status` | Protected | Check enrollment |
| GET | `/{id}/sections` | Public | Get course sections |
| POST | `/{id}/sections` | Protected, Admin | Create section |
| GET | `/sections/{sectionId}` | Public | Get section |
| PUT | `/sections/{sectionId}` | Protected, Admin | Update section |
| DELETE | `/sections/{sectionId}` | Protected, Admin | Delete section |
| GET | `/sections/{sectionId}/lessons` | Public | Get lessons |
| POST | `/sections/{sectionId}/lessons` | Protected, Admin | Create lesson |
| PUT | `/lessons/{lessonId}` | Protected, Admin | Update lesson |
| DELETE | `/lessons/{lessonId}` | Protected, Admin | Delete lesson |

### ❓ QUIZZES (/api/quizzes)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/lesson/{lessonId}` | Protected | Get quiz by lesson |
| GET | `/section/{sectionId}` | Protected | Get section quizzes |
| GET | `/{id}` | Protected | Get quiz details |
| POST | `/` | Protected, Admin | Create quiz |
| PUT | `/{id}` | Protected, Admin | Update quiz |
| DELETE | `/{id}` | Protected, Admin | Delete quiz |
| POST | `/{id}/submit` | Protected | Submit quiz |

### 📖 ENROLLMENTS (/api/enrollments)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/check/{courseId}` | Protected | Check enrollment |
| GET | `/my-courses` | Protected | Get my courses |
| POST | `/` | Protected | Enroll in course |
| GET | `/{id}` | Protected | Get enrollment |
| PUT | `/{id}/progress` | Protected | Update progress |
| DELETE | `/{id}` | Protected | Delete enrollment |

### ⏫ PROGRESS (/api/progress)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/lesson/{id}/complete` | Protected | Mark lesson complete |
| GET | `/course/{id}` | Protected | Get course progress |

### 🎓 CERTIFICATES (/api/certificates)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/` | Protected | Get all certificates |
| GET | `/{id}` | Protected | Get certificate |
| GET | `/status` | Protected | Get certificate status |

### 🎬 LIVE CLASSES (/api/live-classes)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/` | Public | Get all live classes |
| POST | `/` | Protected, Admin | Create live class |
| GET | `/{id}` | Public | Get live class |
| PUT | `/{id}` | Protected, Admin | Update live class |
| DELETE | `/{id}` | Protected, Admin | Delete live class |

### 📰 BLOGS (/api/blogs)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/` | Public | Get all blogs |
| POST | `/` | Protected, Admin | Create blog |
| GET | `/{id}` | Public | Get blog |
| PUT | `/{id}` | Protected, Admin | Update blog |
| DELETE | `/{id}` | Protected, Admin | Delete blog |

### 🤝 VOLUNTEERS (/api/volunteer)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/` | Public | Submit application |
| POST | `/verify-otp` | Public | Verify volunteer OTP |
| GET | `/` | Public | Get all volunteers |
| GET | `/{id}` | Public | Get volunteer |
| PATCH | `/{id}/status` | Protected, Admin | Update status |
| DELETE | `/{id}` | Public | Delete application |

### 🏫 SCHOOLS (/api/registerschool)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/` | Public | Submit registration |
| POST | `/verify-otp` | Public | Verify school OTP |
| GET | `/` | Public | Get all schools |
| GET | `/{id}` | Public | Get school |
| PATCH | `/{id}/status` | Protected, Admin | Update status |
| DELETE | `/{id}` | Public | Delete registration |

### 🗑️ ACCOUNT DELETION (/api/account-deletion-request)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/` | Public | Request deletion |
| POST | `/verify-otp` | Public | Verify with OTP |
| GET | `/verify/{token}` | Public | Verify with token |
| GET | `/all` | Protected, Admin | Get all requests |
| GET | `/{id}` | Public | Get request |
| PATCH | `/{id}/status` | Protected, Admin | Update status |
| DELETE | `/{id}` | Public | Cancel request |

### 🤖 AI CHAT (/api/ai)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/ask` | Protected | Ask question |
| GET | `/history` | Protected | Get chat history |
| GET | `/conversation/{id}` | Protected | Get conversation |
| DELETE | `/conversation/{id}` | Protected | Delete conversation |

### 📊 ANALYTICS (/api/analytics)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/overview` | Protected, Admin | Platform overview |
| GET | `/courses` | Protected, Admin | Course analytics |
| GET | `/enrollments` | Protected, Admin | Enrollment stats |

### 👨‍🎓 STUDENTS (/api/students)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/dashboard` | Protected | Student dashboard |
| GET | `/` | Protected, Admin | Get all students |
| GET | `/{id}` | Protected, Admin | Get student |
| PUT | `/{id}` | Protected, Admin | Update student |
| DELETE | `/{id}` | Protected, Admin | Delete student |

### 📤 UPLOAD (/api/upload)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/` | Protected, Admin | Upload file |

### 📑 DASHBOARD (/api/dashboard)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/` | Public | Dashboard data |

### ✅ HEALTH CHECK
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/api/health` | Public | Health status |
| GET | `/` | Public | API status |

---

## Authentication Header Format
```
Authorization: Bearer {accessToken}
```

---

## Common Request/Response Examples

### OTP Verification Flow
```
1. POST /api/auth/signup → Get OTP
2. POST /api/auth/verify-otp → Get tokens
3. Use tokens in Authorization header
```

### Create Course Flow
```
1. POST /api/courses → Create course
2. POST /api/courses/{id}/sections → Add section
3. POST /api/courses/sections/{sectionId}/lessons → Add lesson
4. POST /api/quizzes → Add quiz
```

### Student Enrollment Flow
```
1. POST /api/courses/{id}/enroll → Enroll
2. GET /api/enrollments/my-courses → View courses
3. POST /api/progress/lesson/{id}/complete → Complete lesson
4. GET /api/progress/course/{id} → Check progress
```

---

## Access Levels
- **Public:** No authentication needed
- **Protected:** Valid JWT token required
- **Admin Only:** JWT token + admin role required

---

## Quick Curl Examples

### Register
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","phone":"9876543210","password":"pass123","role":"student"}'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### Get Courses
```bash
curl http://localhost:4000/api/courses
```

### Get Protected Route
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:4000/api/users/profile
```

### Create Course (Admin)
```bash
curl -X POST http://localhost:4000/api/courses \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Course","description":"Desc","category":"Speaking"}'
```

---

## Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Total Endpoints: 90+

- Auth: 9
- Users: 7
- Courses: 19
- Quizzes: 7
- Enrollments: 6
- Progress: 2
- Certificates: 3
- Live Classes: 5
- Blogs: 5
- Volunteers: 6
- Schools: 6
- Account Deletion: 7
- AI Chat: 4
- Analytics: 3
- Students: 5
- Upload: 1
- Dashboard: 1
- Health: 2

**Total: 103 Endpoints**

---

## Environment Variables
```
PORT=4000
MONGO_URI=mongodb://...
JWT_SECRET=your_secret
JWT_EXPIRE=1h
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

**Last Updated:** December 7, 2025
