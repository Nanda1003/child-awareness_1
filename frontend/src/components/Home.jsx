import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

// This data needs to be consistent with MyLearningPage and RewardsPage
const baseModulesData = [
  { id: '68de157f7ca3507a245679ac', title: 'Healthy Friendships', icon: '🤝' },
  { id: '68deb4ba7ca3507a24567a38', title: 'Understanding Your Body', icon: '💪' },
  { id: '68dec0887ca3507a24567a3c', title: 'Staying Safe Online', icon: '🛡️' },
  { id: '68ded22b7ca3507a24567a40', title: 'Dealing with Big Feelings', icon: '❤️' },
  { id: '68e0b1b37ca3507a24567af3', title: 'Personal Space & Boundaries', icon: '🧘' },
  { id: '68e0b23b7ca3507a24567af4', title: 'Cyberbullying Awareness', icon: '🧠' },
];

const Home = () => {
  const { logout } = useAuth();
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [badgesCollected, setBadgesCollected] = useState(0);
  const [playTime, setPlayTime] = useState('0m');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [userName, setUserName] = useState('');
  const moods = ['Happy', 'Sad', 'Angry', 'Unsure', 'Excited'];
  const navigate = useNavigate();

  // ✅ Load username from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    // Load progress data from localStorage to calculate badges
    const progressData = JSON.parse(localStorage.getItem('learningProgress')) || {};
    let earnedCount = 0;
    const totalModules = baseModulesData.length;

    baseModulesData.forEach(module => {
      const moduleProgress = progressData[module.id] || { checklist: 0, quiz: false };
      
      let totalProgress;
      if (moduleProgress.checklist === 100 && moduleProgress.quiz === true) {
        totalProgress = 100;
      } else {
        const checklistContribution = moduleProgress.checklist * 0.5;
        const quizContribution = moduleProgress.quiz ? 50 : 0;
        totalProgress = Math.round(checklistContribution + quizContribution);
      }

      if (totalProgress === 100) {
        earnedCount++;
      }
    });
    setBadgesCollected(earnedCount);

    // Calculate and format play time (25 minutes per completed module)
    const totalMinutes = earnedCount * 25;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      setPlayTime(`${hours}h ${minutes}m`);
    } else {
      setPlayTime(`${minutes}m`);
    }

    // Calculate progress for the circle graph
    const percentage = totalModules > 0 ? Math.round((earnedCount / totalModules) * 100) : 0;
    setProgressPercentage(percentage);
  }, []);



  return (
    <div className="dashboard-container">
      {/* Main Content Column */}
      <div className="main-content">
        <header className="dashboard-header card">
          <div className="logo">EduKids</div>
          <nav>
            <Link to="/dashboard" className="active">Dashboard</Link>
            <Link to="/learning">My Learning</Link>
            <Link to="/mood">My Mood</Link>
            <Link to="/rewards">Rewards</Link>
          </nav>
          <div className="user-profile">
            <button className="logout-btn" onClick={logout}>Logout</button>
            <img src="/Images/login.jpg" alt="User Avatar" className="avatar" />
          </div>
        </header>

        {/* ✅ Dynamic Welcome Banner */}
        <section className="welcome-banner card">
          <div>
            <h1>Hey {userName ? userName : 'there'}! 👋</h1>
            <p>Let's have some fun learning today!</p>
          </div>
        </section>

        <section className="info-cards">
          <div className="info-card card">
            <div className="info-icon lightbulb">💡</div>
            <div>
              <h3>Fun Fact!</h3>
              <p>Being kind to someone can make both of you feel happy!</p>
            </div>
          </div>
          <div className="info-card card">
            <div className="info-icon trophy">🏆</div>
            <div>
              <h3>Today's Quest</h3>
              <p>Can you share a happy feeling with a friend?</p>
            </div>
          </div>
        </section>

        <section className="whats-next card">
          <h2>What's Next?</h2>
          <div className="module-cards">
            <div className="module-card" onClick={() => navigate('/lesson/68deb4ba7ca3507a24567a38')}>
              <img src="/Images/allaboutme.jpg" alt="Illustration for All About Me module" />
              <h3>All About Me</h3>
              <p>Discover the amazing things your body can do!</p>
            </div>
            <div className="module-card" onClick={() => navigate('/lesson/68de157f7ca3507a245679ac')}>
              <img src="/Images/loveimages.jpg" alt="Illustration for Friends and Feelings module" />
              <h3>Friends & Feelings</h3>
              <p>Learn how to be a great friend to others and yourself.</p>
            </div>
          </div>
          <div className="module-actions">
            <button onClick={() => navigate('/learning')} className="btn btn-primary">
              Let's Learn!
            </button>
          </div>
        </section>

        <section className="mood-tracker card">
          <h2>How do you feel right now?</h2>
          <div className="mood-options">
            {moods.map((mood) => (
              <div
                key={mood}
                className={`mood-option ${selectedMood === mood ? 'selected' : ''}`}
                onClick={() => setSelectedMood(mood)}
              >
                <span className="mood-emoji">
                  {mood === 'Happy' && '😊'}
                  {mood === 'Sad' && '😢'}
                  {mood === 'Angry' && '😠'}
                  {mood === 'Unsure' && '🤔'}
                  {mood === 'Excited' && '😍'}
                </span>
                <span>{mood}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-tertiary">Save My Mood</button>
        </section>
      </div>

      {/* Sidebar Column */}
      <aside className="sidebar">
        <div className="adventure-map-card card">
          <h2>Your Adventure Map</h2>
          <div className="progress-circle" style={{ background: `conic-gradient(var(--secondary-color) ${progressPercentage * 3.6}deg, #F0EBE3 0deg)` }}>
            <div className="progress-inner">
              <span>{badgesCollected}</span>/{baseModulesData.length}
            </div>
          </div>
          <p className="progress-text">Modules Unlocked<br/>Almost there!</p>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-icon">⏰</div>
              <div>
                <span className="stat-label">Play Time</span>
                <span className="stat-value">{playTime}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div>
                <span className="stat-label">Badges Collected</span>
                <span className="stat-value">{badgesCollected}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-wins" onClick={() => navigate('/rewards')}>See All My Wins!</button>
        
        <div className="sidebar-widgets">
          <div className="card sidebar-card">
            <div className="icon">✨</div>
            <h3>Daily Affirmation</h3>
            <p>I am smart, I am kind, and I can do amazing things!</p>
          </div>

          <div className="card sidebar-card">
            <div className="icon">🏅</div>
            <h3>Featured Badge</h3>
            <p>Earn the "Mindful Master" badge by completing today's mood log.</p>
            <button className="btn btn-badge">Log My Mood!</button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Home;
