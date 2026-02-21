// client/src/App.js
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import ContestHome from './pages/Contest/ContestHome';
import AITeacherPage from './pages/AITeacherPage';
import AIFloatingButton from './components/common/AIFloatingButton';
import MeetingRoom from './components/LiveClass/MeetingRoom';

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
import ContestManagement from './pages/admin/ContestManagement';
import CouponManagement from './pages/admin/CouponManagement';
import ContestAdminDashboard from './pages/admin/ContestAdminDashboard';
// Category management removed

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import CoursePlayer from './pages/CoursePlayer';
import VerifyOTP from './components/auth/VerifyOTP';
import CompleteProfile from './pages/CompleteProfile';
import EnglishSpeaking from './pages/EnglishSpeaking';
import StudentDashboard from './pages/student/StudentBoard';
import Certificate from './pages/Certificate';

import './App.css';

// Games
import BirdSaver from './components/games/BirdSaver';
import LockAndKey from './components/games/LockAndKey';
import VocabularyBuilder from './components/games/VocabularyBuilder';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

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
          <Toaster 
            position="top-center"
            reverseOrder={false}
            containerStyle={{
              zIndex: 100000,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
              },
              success: {
                style: {
                  background: '#10B981',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10B981',
                },
              },
              error: {
                 style: {
                  background: '#EF4444',
                  color: '#fff',
                },
                 iconTheme: {
                  primary: '#fff',
                  secondary: '#EF4444',
                },
              },
            }}
          />
          
          <Navbar />
          <AIFloatingButton />
         <main className="pt-[110px]">
          <Routes>

  {/* ================= PUBLIC ROUTES ================= */}
  <Route path="/" element={<Home />} />
  <Route path="/courses" element={<Courses />} />
  <Route path="/courses/:id" element={<CourseDetail />} />
  <Route path="/games" element={<Games />} />
  <Route path="/games/bird-saver" element={<BirdSaver />} />
  <Route path="/games/lock-and-key" element={<LockAndKey />} />
  <Route path="/games/vocabulary-builder" element={<VocabularyBuilder />} />
  <Route path="/live-classes" element={<LiveClasses />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/verify-otp" element={<VerifyOTP />} />
  <Route path="/complete-profile" element={<CompleteProfile />} />
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

  <Route 
    path="/courses/:courseId/section/:sectionId/quiz" 
    element={<Quiz />} 
  />

  <Route
    path="/courses/:courseId/assignment/:assignmentId"
    element={
      <ProtectedRoute>
        <AssignmentTest />
      </ProtectedRoute>
    }
  />

  <Route
    path="/courses/:courseId/assignment/:assignmentId/results"
    element={
      <ProtectedRoute>
        <AssignmentResults />
      </ProtectedRoute>
    }
  />


  {/* ================= ADMIN ROUTES ================= */}
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
    path="/admin/contests"
    element={
      <ProtectedRoute adminOnly>
        <ContestAdminDashboard />
      </ProtectedRoute>
    }
  />

  <Route 
    path="/admin/coupons"
    element={
      <ProtectedRoute adminOnly>
        <CouponManagement />
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

  {/* Category management removed */}


  {/* ================= STUDENT ROUTES ================= */}
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

  <Route 
    path="/certificate"
    element={
      <ProtectedRoute>
        <Certificate />
      </ProtectedRoute>
    }
  />


  {/* ================= SHARED PROTECTED ROUTES ================= */}
  <Route 
    path="/spokee"
    element={
      <ProtectedRoute>
        <Spokee />
      </ProtectedRoute>
    }
  />

  <Route 
    path="/ai-teacher"
    element={
      <ProtectedRoute>
        <AITeacherPage />
      </ProtectedRoute>
    }
  />

  <Route 
    path="/contest"
    element={
      <ProtectedRoute>
        <ContestHome />
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

  <Route 
    path="/live-classes/join/:id" 
    element={
      <ProtectedRoute>
        <MeetingRoom />
      </ProtectedRoute>
    } 
  />

          </Routes>
          </main>
          
          {!isAdminRoute && <Footer />}
        </div>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;