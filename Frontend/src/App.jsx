// client/src/App.js
import React from 'react';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Games from './pages/Games';
import LiveClasses from './pages/LiveClasses';
import Spokee from './pages/Spokee';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import HowItWorks from './pages/HowItWorks';
import Volunteer from './pages/Volunteer';
import AccountDeletionForm from './pages/UserAccountDeletion';
import SchoolRegistration from './pages/SchoolRegistration';
import LessonView from './pages/LessonView';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Quiz from './pages/Quiz';
import AssignmentTest from './pages/AssignmentTest';
import AssignmentResults from './pages/AssignmentResults';



import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';


// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import BlogManagement from './pages/admin/BlogManagement';
import CourseManagement from './pages/admin/CourseManagement';
import StudentAnalytics from './pages/admin/StudentAnalytics';
import Analytics from './pages/admin/Analytics';
import LiveClassManagement from './pages/admin/LiveClassManagement';
import CourseBuilder from './pages/admin/CourseBuilder';
import SchoolRegistrationManagement from './pages/admin/SchoolRegistrationManagement';
import VolunteerManagement from './pages/admin/VolunteerManagement';
import AccountDeletionManagement from './pages/admin/AccountDeletionManagement';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import CoursePlayer from './pages/CoursePlayer';
import VerifyOTP from './components/auth/VerifyOTP';
import EnglishSpeaking from './pages/EnglishSpeaking';
import StudentDashboard from './pages/student/StudentBoard';

import './App.css';

function App() {
   useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);
  return (
    <AuthProvider>
      <CourseProvider>
        <ScrollToTop />
        <div className="App">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/games" element={<Games />} />
            <Route path="/live-classes" element={<LiveClasses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/howitworks" element={<HowItWorks />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/englishspeaking" element={<EnglishSpeaking />} />
            <Route path="/accountdeletion" element={<AccountDeletionForm />} />
            <Route path="/contest/schoolregistration" element={<SchoolRegistration />} />
            <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonView />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/courses/:courseId/section/:sectionId/quiz" element={<Quiz />} />
            <Route path="/courses/:courseId/assignment/:assignmentId" element={
              <ProtectedRoute>
                <AssignmentTest />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/assignment/:assignmentId/results" element={
              <ProtectedRoute>
                <AssignmentResults />
              </ProtectedRoute>
            } />

            {/* ============ ADMIN ROUTES (Admin Only) ============ */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/courses" 
              element={
                <ProtectedRoute adminOnly>
                  <CourseManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/courses/:id/builder" 
              element={
                <ProtectedRoute adminOnly>
                  <CourseBuilder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/studentanalytics" 
              element={
                <ProtectedRoute adminOnly>
                  <StudentAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute adminOnly>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/live-classes" 
              element={
                <ProtectedRoute adminOnly>
                  <LiveClassManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs" 
              element={
                <ProtectedRoute adminOnly>
                  <BlogManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
  path="/admin/schools" 
  element={
    <ProtectedRoute adminOnly>
      <SchoolRegistrationManagement />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/volunteers" 
  element={
    <ProtectedRoute adminOnly>
      <VolunteerManagement />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/account-deletions" 
  element={
    <ProtectedRoute adminOnly>
      <AccountDeletionManagement />
    </ProtectedRoute>
  } 
/>
            {/* ============ STUDENT ROUTES (Student Only) ============ */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute studentOnly>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute studentOnly>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* ============ SHARED PROTECTED ROUTES (Any Authenticated User) ============ */}
            <Route 
              path="/spokee" 
              element={
                <ProtectedRoute>
                  <Spokee />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course/:courseId/player/:dayIndex/:lessonIndex" 
              element={
                <ProtectedRoute>
                  <CoursePlayer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course/:courseId/player" 
              element={
                <ProtectedRoute>
                  <CoursePlayer />
                </ProtectedRoute>
              } 
            />
          </Routes>
          
          <Footer />
        </div>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;