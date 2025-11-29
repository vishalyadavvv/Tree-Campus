// client/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Remove BrowserRouter import
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import ScrollToTop from './components/ScrollToTop';
import AdminDashboard from './pages/AdminDashboard';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Games from './pages/Games';
import LiveClasses from './pages/LiveClasses';
import Spokee from './pages/Spokee';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import HowItWorks from './pages/HowItWorks';
import Volunteer from './pages/Volunteer';
import AccountDeletionForm from './pages/UserAccountDeletion';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

import CoursePlayer from './pages/CoursePlayer';
import VerifyOTP from './components/auth/VerifyOTP';

import './App.css';
import EnglishSpeakingPlatform from './pages/EnglishSpeaking';

function App() {

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
             <Route path="/englishspeaking" element={<EnglishSpeakingPlatform />} />
            <Route path="/accountdeletion" element={<AccountDeletionForm />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/spokee" 
              element={
                <ProtectedRoute>
                  <Spokee />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            <Route path="/course/:courseId/player/:dayIndex/:lessonIndex" element={<CoursePlayer />} />
            <Route path="/course/:courseId/player" element={<CoursePlayer />} />
          </Routes>
          <Footer />
        </div>
        {/* ✅ Remove closing </Router> tag */}
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;



// The correct hierarchy is now:
// ```
// main.jsx:
//   BrowserRouter
//     └── App
//         └── AuthProvider
//             └── CourseProvider
//                 └── Routes/Components