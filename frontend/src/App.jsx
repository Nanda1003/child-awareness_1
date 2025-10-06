import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 👈 IMPORT

// Import all your page components...
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import MyLearningPage from './components/MyLearningPage';
import LessonPage from './components/LessonPage';
import HFquiz from './components/HFquiz';
import MyMoodPage from './components/MyMoodPage';
import RewardsPage from './components/RewardsPage';
import CounselorDashboard from './components/CounselorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider> {/* 👈 WRAP */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/learning" element={<MyLearningPage />} />
            <Route path="/mood" element={<MyMoodPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/help" element={<Home />} />
            <Route path="/lesson/:moduleId" element={<LessonPage />} />
            <Route path="/quiz/:moduleId" element={<HFquiz />} />
          </Route>

          {/* Protected Counselor Route */}
          <Route element={<ProtectedRoute allowedRoles={['Counselor']} />}>
            <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
          </Route>
        </Routes>
      </AuthProvider> {/* 👈 WRAP */}
    </Router>
  );
}

export default App;