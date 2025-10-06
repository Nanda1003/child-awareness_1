import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RewardsPage.css';

// Base module data to generate badges from. This should be consistent with MyLearningPage.
const baseModulesData = [
  { id: '68de157f7ca3507a245679ac', title: 'Healthy Friendships', icon: '🤝' },
  { id: '68deb4ba7ca3507a24567a38', title: 'Understanding Your Body', icon: '💪' },
  { id: '68dec0887ca3507a24567a3c', title: 'Staying Safe Online', icon: '🛡️' },
  { id: '68ded22b7ca3507a24567a40', title: 'Dealing with Big Feelings', icon: '❤️' },
  { id: '68e0b1b37ca3507a24567af3', title: 'Personal Space & Boundaries', icon: '🧘' },
  { id: '68e0b23b7ca3507a24567af4', title: 'Cyberbullying Awareness', icon: '🧠' },
];

const RewardsPage = () => {
  const navigate = useNavigate();
  const [stars, setStars] = useState(0);
  const [badges, setBadges] = useState([]);
  const [nextRewardProgress, setNextRewardProgress] = useState(0);

  useEffect(() => {
    // Load progress data from localStorage
    const progressData = JSON.parse(localStorage.getItem('learningProgress')) || {};
    let totalStars = 0;
    const inProgressModules = [];

    const updatedBadges = baseModulesData.map(module => {
      const moduleProgress = progressData[module.id] || { checklist: 0, quiz: false };
      
      // Stricter progress calculation to match MyLearningPage:
      let totalProgress;
      if (moduleProgress.checklist === 100 && moduleProgress.quiz === true) {
        totalProgress = 100;
      } else {
        // Otherwise, progress is a 50/50 split.
        const checklistContribution = moduleProgress.checklist * 0.5;
        const quizContribution = moduleProgress.quiz ? 50 : 0;
        totalProgress = Math.round(checklistContribution + quizContribution);
      }
      const isEarned = totalProgress === 100;
      if (isEarned) {
        totalStars += 100;
      } else if (totalProgress > 0) {
        inProgressModules.push(totalProgress);
      }

      return {
        id: module.id,
        name: module.title,
        description: `Complete the "${module.title}" module.`,
        earned: isEarned,
        icon: module.icon,
      };
    });

    setStars(totalStars);
    setBadges(updatedBadges);

    // Calculate progress for the "Next Reward" bar.
    // If there are modules in progress, show the highest progress.
    // This is now changed to show overall progress towards earning all badges.
    const earnedCount = updatedBadges.filter(b => b.earned).length;
    const totalBadges = updatedBadges.length;
    const nextProgress = totalBadges > 0 ? Math.round((earnedCount / totalBadges) * 100) : 0;

    setNextRewardProgress(nextProgress);
  }, []);

  const { logout } = useAuth();

  return (
    <div className="rewards-page-container">
      <header className="dashboard-header card">
        <div className="logo">EduKids</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learning">My Learning</Link>
          <Link to="/mood">My Mood</Link>
          <Link to="/rewards" className="active">Rewards</Link>
          {/* <Link to="/help">Help</Link> */}
        </nav>
        <div className="user-profile">
          <button className="logout-btn" onClick={logout}>Logout</button>
          <img src="/Images/login.jpg" alt="User Avatar" className="avatar" />
        </div>
      </header>

      <main className="rewards-content">
        <div className="rewards-title">
          <h1>Your Awesome Rewards!</h1>
          <p>Great job! Check out all the cool badges you've collected.</p>
        </div>

        <div className="rewards-summary card">
          <div className="summary-item">
            <span className="summary-icon">⭐</span>
            <span className="summary-value">{stars}</span>
            <span className="summary-label">Stars Collected</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">🏆</span>
            <span className="summary-value">{badges.filter(b => b.earned).length} / {badges.length}</span>
            <span className="summary-label">Badges Unlocked</span>
          </div>
        </div>

        <div className="next-reward-section card">
            <h3>Almost there!</h3>
            <p>You're so close to unlocking your next badge!</p>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${nextRewardProgress}%` }}></div>
            </div>
            <span className="progress-text">{nextRewardProgress}% of the way</span>
        </div>

        <div className="badges-section">
          <h2>My Badge Collection</h2>
          <div className="badges-grid">
            {badges.filter(b => b.earned).map(badge => (
              <div key={badge.id} className="badge-card earned">
                <div className="badge-icon">{badge.icon}</div>
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
              </div>
            ))}
             {badges.filter(b => !b.earned).map(badge => (
              <div key={badge.id} className="badge-card locked" title={`Hint: ${badge.description}`}>
                <div className="badge-icon">🔒</div>
                <h3>{badge.name}</h3>
                <p>Keep learning to unlock!</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="back-to-dashboard">
          <Link to="/dashboard" className="btn btn-back">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default RewardsPage;
