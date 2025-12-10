# Tree Campus - Learning Management System
## Complete Project Documentation

---

## 📚 **TABLE OF CONTENTS**

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [User Roles](#user-roles)
5. [Admin Panel Guide](#admin-panel-guide)
6. [Student Panel Guide](#student-panel-guide)
7. [Certificate System](#certificate-system)
8. [Installation & Setup](#installation-setup)

---

## 📋 **PROJECT OVERVIEW**

**Tree Campus** is a comprehensive Learning Management System (LMS) designed to facilitate online education. The platform provides a complete solution for course management, student enrollment, assignments, quizzes, and certification.

### **Project Goals:**
- Provide an intuitive platform for online learning
- Enable administrators to manage courses, students, and content efficiently
- Offer students a seamless learning experience
- Automate certificate generation upon course completion
- Track student progress and performance

---

## ✨ **KEY FEATURES**

### **For Administrators:**
1. **User Management**
   - View and manage all registered students
   - Approve/reject school registrations
   - Handle volunteer applications
   - Process account deletion requests

2. **Course Management**
   - Create, edit, and delete courses
   - Upload course materials (videos, documents)
   - Organize content into sections and lessons
   - Set course pricing and enrollment limits

3. **Assessment Creation**
   - Build quizzes with multiple question types
   - Create assignments with scoring rubrics
   - Set passing scores and time limits
   - Track student submissions and grades

4. **Analytics & Reporting**
   - Monitor student enrollment and progress
   - View course completion rates
   - Generate performance reports
   - Track certificate issuance

### **For Students:**
1. **Course Enrollment**
   - Browse available courses
   - Enroll in courses of interest
   - Track enrolled courses on dashboard

2. **Learning Experience**
   - Access course videos and materials
   - Follow structured lessons
   - Complete quizzes and assignments
   - Track learning progress

3. **Assessments**
   - Take quizzes with immediate feedback
   - Submit assignments for grading
   - View scores and results
   - Retry failed assessments (if allowed)

4. **Certification**
   - Earn certificates upon completion
   - Download professional PDF certificates
   - View all earned certificates in profile

---

## 💻 **TECHNOLOGY STACK**

### **Frontend:**
- **React.js** - User interface framework
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling and responsive design
- **Axios** - API communication
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **jsPDF** - PDF generation
- **dom-to-image-more** - Certificate rendering

### **Backend:**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Media storage

### **Additional Tools:**
- **Multer** - File upload handling
- **Nodemailer** - Email notifications
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

## 👥 **USER ROLES**

### **1. Administrator**
- **Access Level:** Full system access
- **Capabilities:** 
  - Manage all users and courses
  - Create and grade assessments
  - View analytics and reports
  - Configure system settings
  - Issue certificates

### **2. Student**
- **Access Level:** Limited to enrolled courses
- **Capabilities:**
  - Browse and enroll in courses
  - Access learning materials
  - Complete assessments
  - Earn and download certificates
  - View personal dashboard

---

## 🔧 **ADMIN PANEL GUIDE**

### **1. Login to Admin Panel**
- Navigate to the login page
- Select "Admin Login"
- Enter admin credentials
- Access admin dashboard

### **2. Dashboard Overview**
The admin dashboard displays:
- Total users count
- Total courses count
- Total certificates issued
- Recent enrollments
- Pending approvals

### **3. Course Management**

#### **Creating a New Course:**
1. Click "Courses" in the sidebar
2. Click "Create New Course" button
3. Fill in course details:
   - Course title
   - Description
   - Category
   - Price
   - Thumbnail image
   - Instructor information
4. Click "Create Course"

#### **Adding Course Content:**
1. Select a course from the list
2. Click "Course Builder"
3. Add sections:
   - Click "Add Section"
   - Enter section title
   - Click "Save"
4. Add lessons to sections:
   - Click "Add Lesson"
   - Enter lesson title
   - Upload video (Cloudinary)
   - Add description
   - Set duration
   - Click "Save Lesson"
5. Reorder content using drag-and-drop

#### **Creating Quizzes:**
1. Open course in Course Builder
2. Click "Add Quiz"
3. Configure quiz settings:
   - Quiz title
   - Passing score (%)
   - Time limit
4. Add questions:
   - Click "Add Question"
   - Enter question text
   - Choose question type (Multiple Choice, True/False)
   - Add answer options
   - Mark correct answer
   - Set points
5. Click "Save Quiz"

#### **Creating Assignments:**
1. Open course in Course Builder
2. Click "Add Assignment"
3. Configure assignment:
   - Assignment title
   - Description
   - Questions (multiple questions supported)
   - Answer options for each question
   - Correct answers
   - Points per question
   - Total points
   - Passing percentage
4. Click "Save Assignment"

### **4. User Management**

#### **Viewing All Users:**
1. Click "Users" in sidebar
2. View list of all registered students
3. Search/filter users
4. View user details

#### **Managing School Registrations:**
1. Click "School Requests" in sidebar
2. View pending school registration requests
3. Review details:
   - School name
   - Principal name
   - Email & phone
   - Address
4. Actions:
   - Click "Approve" to accept
   - Click "Reject" to decline

#### **Managing Volunteer Applications:**
1. Click "Volunteers" in sidebar
2. View pending volunteer applications
3. Review applicant information
4. Approve or reject applications

#### **Account Deletion Requests:**
1. Click "Delete Requests" in sidebar
2. View deletion requests
3. Review user information
4. Approve deletion (permanent action)

### **5. Analytics & Monitoring**
- View enrollment statistics
- Track course completion rates
- Monitor quiz/assignment submissions
- Generate certificate reports
- Export data for analysis

---

## 📱 **STUDENT PANEL GUIDE**

### **1. Registration & Login**

#### **Creating an Account:**
1. Go to the homepage
2. Click "Register" or "Sign Up"
3. Fill in registration form:
   - Full name
   - Email address
   - Password
   - Confirm password
4. Verify email (if enabled)
5. Click "Create Account"

#### **Logging In:**
1. Click "Login"
2. Enter email and password
3. Click "Sign In"
4. Access student dashboard

### **2. Student Dashboard**
The dashboard shows:
- Enrolled courses
- Recent activity
- Progress overview
- Upcoming deadlines
- Certificates earned

### **3. Browsing & Enrolling in Courses**

#### **Finding Courses:**
1. Click "Courses" in navigation
2. Browse available courses
3. Use filters:
   - Category
   - Price range
   - Difficulty level
4. View course details:
   - Description
   - Syllabus
   - Instructor
   - Duration
   - Reviews

#### **Enrolling in a Course:**
1. Click on desired course
2. Click "Enroll Now" button
3. Confirm enrollment
4. Access course immediately

### **4. Learning Experience**

#### **Accessing Course Content:**
1. Go to "My Courses" or Dashboard
2. Click on enrolled course
3. View course structure:
   - Sections
   - Lessons
   - Quizzes
   - Assignments

#### **Watching Lessons:**
1. Click on a lesson
2. Video player loads automatically
3. Watch at your own pace
4. Use controls:
   - Play/Pause
   - Volume
   - Fullscreen
   - Speed control
5. Lesson marked as complete when finished

#### **Organizing Learning:**
- Follow sequential lesson structure
- Track progress percentage
- Resume from last watched lesson
- Access downloadable resources

### **5. Taking Quizzes**

#### **Starting a Quiz:**
1. Navigate to quiz in course content
2. Read instructions carefully
3. Note:
   - Time limit
   - Passing score
   - Number of questions
4. Click "Start Quiz"

#### **Answering Questions:**
1. Read each question carefully
2. Select answer (radio buttons for single choice)
3. Navigate between questions using "Next"/"Previous"
4. Review flagged questions
5. Click "Submit Quiz" when complete

#### **Viewing Results:**
- Immediate score display
- Correct/incorrect answers shown
- Percentage achieved
- Pass/Fail status
- Option to retake (if allowed)

### **6. Completing Assignments**

#### **Starting an Assignment:**
1. Click on assignment in course
2. Read assignment instructions
3. Review questions and requirements
4. Click "Start Assignment"

#### **Submitting Answers:**
1. Answer each question
2. Select from multiple choice options
3. Review all answers
4. Click "Submit Assignment"

#### **Viewing Results:**
- Automatic grading
- Score breakdown
- Percentage achieved
- Pass/Fail determination
- Certificate generation (if passed)

### **7. Viewing Certificates**

#### **Accessing Certificates:**
1. Click "Certificates" in navigation OR
2. Go to Dashboard → View Certificates

#### **Certificate Display:**
- Professional certificate design
- Student name
- Course name
- Completion date
- Certificate number
- Digital signature

#### **Downloading Certificates:**
1. Hover over certificate
2. Click "Download PDF" button
3. PDF generates with:
   - High-quality rendering
   - Professional template
   - A4 landscape format
   - Ready for printing

### **8. Profile Management**

#### **Updating Profile:**
1. Click profile icon
2. Select "My Profile"
3. Edit information:
   - Name
   - Email
   - Phone number
   - Profile picture
4. Click "Save Changes"

#### **Changing Password:**
1. Go to Profile Settings
2. Click "Change Password"
3. Enter:
   - Current password
   - New password
   - Confirm new password
4. Click "Update Password"

---

## 🎓 **CERTIFICATE SYSTEM**

### **Certificate Generation Process:**

1. **Trigger Events:**
   - Passing an assignment (≥60%)
   - Completing a quiz with passing score
   - Finishing all course requirements

2. **Automatic Generation:**
   - System creates certificate record in database
   - Assigns unique certificate number
   - Links to user and course
   - Stores issue date

3. **Certificate Details:**
   - Student name
   - Course title
   - Completion date
   - Certificate ID
   - Professional template design
   - Tree Campus branding

4. **Download Features:**
   - PDF format (A4 landscape)
   - High-quality rendering
   - Professional design
   - Ready for printing/sharing
   - Digital verification ID

### **Certificate Template:**
- Dark blue gradient background
- Orange accent elements
- Curved white content area
- Dual logo placement
- Decorative line patterns
- Professional typography
- Signature section
- Date of issuance

---

## 🚀 **INSTALLATION & SETUP**

### **Prerequisites:**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Email service (for notifications)

### **Backend Setup:**

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env` file:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

### **Frontend Setup:**

1. **Navigate to frontend folder:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env` file:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access application:**
   Open browser: `http://localhost:5173`

### **Admin Account Creation:**
Create admin user manually in MongoDB:
```javascript
{
  name: "Admin",
  email: "admin@treecampus.com",
  password: "hashed_password", // Use bcrypt
  role: "admin",
  isEmailVerified: true
}
```

---

## 📊 **SYSTEM WORKFLOWS**

### **Student Course Enrollment Flow:**
1. Student logs in
2. Browses courses
3. Views course details
4. Clicks "Enroll"
5. Gets access to course content
6. Appears in "My Courses"

### **Assignment Submission Flow:**
1. Student accesses assignment
2. Answers all questions
3. Submits assignment
4. System auto-grades
5. Score calculated
6. If passed (≥60%):
   - Certificate generated
   - Added to student profile
   - Available for download

### **Certificate Download Flow:**
1. Student navigates to Certificates page
2. Views earned certificates
3. Hovers over certificate
4. Clicks "Download PDF"
5. System:
   - Renders certificate template
   - Overlays student name
   - Adds course details
   - Generates PDF (A4 landscape)
   - Downloads to device

---

## 🔐 **SECURITY FEATURES**

### **Authentication:**
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes (frontend & backend)
- Session management

### **Authorization:**
- Role-based access control
- Admin-only routes
- Student-specific access
- API endpoint protection

### **Data Protection:**
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection
- CORS configuration
- Environment variable security

---

## 📈 **FUTURE ENHANCEMENTS**

### **Planned Features:**
1. **Live Classes:**
   - Video conferencing integration
   - Screen sharing
   - Chat functionality
   - Recording capabilities

2. **Discussion Forums:**
   - Course-specific forums
   - Student discussions
   - Instructor Q&A
   - Peer learning

3. **Advanced Analytics:**
   - Learning analytics dashboard
   - Student performance insights
   - Course effectiveness metrics
   - Engagement tracking

4. **Mobile Application:**
   - React Native app
   - Offline content access
   - Push notifications
   - Mobile-optimized learning

5. **Payment Integration:**
   - Multiple payment gateways
   - Subscription plans
   - Bulk enrollment discounts
   - Invoice generation

6. **Gamification:**
   - Points and badges
   - Leaderboards
   - Achievements
   - Learning streaks

---

## 📞 **SUPPORT & CONTACT**

### **For Technical Issues:**
- Email: support@treecampus.com
- Help Center: Available in dashboard
- Documentation: This guide

### **For Course Content:**
- Contact course instructor
- Submit feedback
- Report issues

### **For Administrators:**
- Admin help guide
- System documentation
- Technical support

---

## 📝 **VERSION HISTORY**

### **Version 1.0 (Current)**
- Initial release
- Core LMS functionality
- Course management
- Quiz and assignment system
- Certificate generation
- User management

---

## ⚖️ **LICENSE**
Tree Campus Learning Management System
© 2025 Tree Campus Academy
All rights reserved.

---

## 🎯 **CONCLUSION**

Tree Campus LMS provides a complete solution for online education, combining powerful administrative tools with an intuitive student experience. The platform streamlines course delivery, assessment, and certification while maintaining ease of use for all stakeholders.

**Key Strengths:**
- ✅ User-friendly interface
- ✅ Comprehensive course management
- ✅ Automated assessment and grading
- ✅ Professional certificate generation
- ✅ Scalable architecture
- ✅ Mobile-responsive design
- ✅ Secure and reliable

**Perfect For:**
- Educational institutions
- Online course creators
- Corporate training programs
- Skill development platforms
- Certification programs

---

*For more information or support, contact Tree Campus Academy*
