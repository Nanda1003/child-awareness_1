import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login'; // Import the new Login component
import Home from './components/Home';
import MyLearningPage from './components/MyLearningPage';
import LessonPage from './components/LessonPage';
import HFquiz from './components/HFquiz';
import MyMoodPage from './components/MyMoodPage';
import RewardsPage from './components/RewardsPage';
import ProtectedRoute from './components/ProtectedRoute';
import CounselorDashboard from './components/CounselorDashboard'; // Import the new Counselor Dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/learning" element={<MyLearningPage />} />
          <Route path="/lesson/:moduleId" element={<LessonPage />} />
          <Route path="/quiz/:moduleId" element={<HFquiz />} />
          <Route path="/mood" element={<MyMoodPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Route>
 
        {/* Protected Counselor Route */}
        <Route element={<ProtectedRoute allowedRoles={['Counselor']} />}>
          <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;