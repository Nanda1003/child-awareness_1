import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MyLearningPage.css';

const baseModulesData = [
  { id: '68de157f7ca3507a245679ac', title: 'Healthy Friendships', description: 'Learn how to build and maintain positive relationships.', progress: 100, status: 'Completed', category: 'Feelings', hasQuiz: true },
  { id: '68deb4ba7ca3507a24567a38', title: 'Understanding Your Body', description: 'Explore the changes your body goes through as you grow.', progress: 60, status: 'In Progress', category: 'Body', hasQuiz: true },
  { id: '68dec0887ca3507a24567a3c', title: 'Staying Safe Online', description: 'Discover how to be a smart and safe digital citizen.', progress: 20, status: 'In Progress', category: 'Safety', hasQuiz: true },
  { id: '68ded22b7ca3507a24567a40', title: 'Dealing with Big Feelings', description: 'Understand emotions like anger and sadness.', progress: 0, status: 'Not Started', category: 'Feelings', hasQuiz: true },
  { id: '68e0b1b37ca3507a24567af3', title: 'Personal Space & Boundaries', description: 'Learn about respecting your own and others\' personal space.', progress: 0, status: 'Not Started', category: 'Body', hasQuiz: true },
  { id: '68e0b23b7ca3507a24567af4', title: 'Cyberbullying Awareness', description: 'How to identify and respond to cyberbullying.', progress: 0, status: 'Not Started', category: 'Safety', hasQuiz: true },
];

const MyLearningPage = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.filter || 'All');
  const [modules, setModules] = useState(baseModulesData);
  const navigate = useNavigate();

  // Set logged-in student info (replace with real login values)
  useEffect(() => {
    const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
    if (loggedInStudent) {
      localStorage.setItem('userName', loggedInStudent.name);
      localStorage.setItem('userEmail', loggedInStudent.email);
      localStorage.setItem('userSchool', loggedInStudent.school);
    }
  }, []);



  // Load progress
  useEffect(() => {
    const progressData = JSON.parse(localStorage.getItem('learningProgress')) || {};
    const updatedModules = baseModulesData.map(module => {
      const moduleProgress = progressData[module.id] || { checklist: 0, quiz: false };

      let totalProgress;
      if (moduleProgress.checklist === 100 && moduleProgress.quiz === true) {
        totalProgress = 100;
      } else {
        const checklistContribution = moduleProgress.checklist * 0.5;
        const quizContribution = moduleProgress.quiz ? 50 : 0;
        totalProgress = Math.round(checklistContribution + quizContribution);
      }

      let status = 'Not Started';
      if (totalProgress === 100) status = 'Completed';
      else if (totalProgress > 0) status = 'In Progress';

      return { ...module, progress: totalProgress, status };
    });
    setModules(updatedModules);
  }, [location.key]);

  const filteredModules = filter === 'All' ? modules : modules.filter(module => module.category === filter);

  return (
    <div className="learning-page-container">
      <header className="dashboard-header card">
        <div className="logo">EduKids</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learning" className="active">My Learning</Link>
          <Link to="/mood">My Mood</Link>
          <Link to="/rewards">Rewards</Link>
          {/* <Link to="/help">Help</Link> */}
        </nav>
        <div className="user-profile">
          <button className="logout-btn" onClick={logout}>Logout</button>
          <img src="/Images/login.jpg" alt="User Avatar" className="avatar" />
        </div>
      </header>

      <main className="learning-content">
        <div className="learning-title">
          <h1>My Learning Path</h1>
          <p>Your awesome adventure in learning starts now!</p>
        </div>

        <div className="filter-buttons">
          {['All', 'Body', 'Feelings', 'Safety'].map(category => (
            <button key={category} onClick={() => setFilter(category)} className={`filter-btn ${filter === category ? 'active' : ''}`}>
              {category} Modules
            </button>
          ))}
        </div>

        <div className="modules-grid">
          {filteredModules.map(module => (
            <div key={module.id} className="card module-card-learning">
              <div className={`status-tag ${(module.status || '').replace(' ', '-').toLowerCase()}`}>{module.status || 'Status Unknown'}</div>
              <h3>{module.title}</h3>
              <p className="module-description">{module.description}</p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${module.progress}%` }}></div>
              </div>
              <span className="progress-text">{module.progress}% Complete</span>
              <div className="module-actions">
                <Link to={`/lesson/${module.id}`} className="btn btn-lesson">
                  {module.progress === 100 ? 'Review' : (module.progress > 0 ? 'Continue' : 'Start Lesson')}
                </Link>
                {module.hasQuiz ? (
                  <Link to={`/quiz/${module.id}`} className="btn btn-quiz">Take Quiz</Link>
                ) : (
                  <button className="btn btn-quiz disabled" disabled>Quiz Coming Soon</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="back-to-dashboard">
          <Link to="/dashboard" className="btn btn-back">Back to Dashboard</Link>
        </div>
      </main>
    </div>
  );
};

export default MyLearningPage;
