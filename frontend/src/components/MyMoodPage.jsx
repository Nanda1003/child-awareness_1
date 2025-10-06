import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MyMoodPage.css';

const MyMoodPage = () => {
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [moodHistory, setMoodHistory] = useState({});
  // State for the new entry being typed
  const [newJournalEntry, setNewJournalEntry] = useState(''); 
  // State for the list of all saved entries
  const [journalHistory, setJournalHistory] = useState([]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  // NEW: State to manage the concern pop-up
  const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);

  useEffect(() => {
    const savedMoods = JSON.parse(localStorage.getItem('moodHistory'));
    if (savedMoods) {
      setMoodHistory(savedMoods);
    }
    // Load saved journal history
    const savedHistory = JSON.parse(localStorage.getItem('journalHistory'));
    if (savedHistory) {
      setJournalHistory(savedHistory);
    }
  }, []);

  const { logout } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const moods = [
    { name: 'Happy', emoji: '😊' },
    { name: 'Sad', emoji: '😢' },
    { name: 'Angry', emoji: '😠' },
    { name: 'Unsure', emoji: '🤔' },
    { name: 'Excited', emoji: '😍' },
  ];

  const copingStrategies = {
    Happy: "That's wonderful! Sharing your happiness can make someone else's day brighter too!",
    Sad: "It's okay to feel sad. Try listening to your favorite happy song or drawing something you love.",
    Angry: "When you feel angry, taking five deep breaths or squeezing a pillow can help you feel calm.",
    Unsure: "Feeling unsure is normal. Talking to a parent or a trusted friend can help clear your thoughts.",
    Excited: "Yay! Channel that amazing energy into a fun activity like dancing or playing a game."
  };

  // NEW: Function to check for concerning mood patterns
  const checkMoodPatterns = (history) => {
    const moodsLogged = Object.values(history);
    const sadCount = moodsLogged.filter(emoji => emoji === '😢').length;
    const happyCount = moodsLogged.filter(emoji => emoji === '😊').length;

    // Trigger if there are 15 or more sad days and no happy days logged
    if (sadCount >= 15 && happyCount === 0) {
      setIsConcernModalOpen(true);
    }
  };

  const handleDayClick = (dayIndex) => {
    setSelectedDay(dayIndex + 1);
    setIsModalOpen(true);
  };

  const handleMoodSelectForDay = (mood) => {
    const newMoodHistory = {
      ...moodHistory,
      [selectedDay]: mood.emoji,
    };
    setMoodHistory(newMoodHistory);
    localStorage.setItem('moodHistory', JSON.stringify(newMoodHistory));
    setIsModalOpen(false); // Close the mood selection modal
    checkMoodPatterns(newMoodHistory); // Check patterns after every update
  };

  const handleSaveJournal = () => {
    if (newJournalEntry.trim() === '') {
      alert('Please write something in your journal before saving.');
      return;
    }

    const newEntry = {
      text: newJournalEntry,
      // Store the date in a readable format
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    const updatedHistory = [newEntry, ...journalHistory];
    setJournalHistory(updatedHistory);
    localStorage.setItem('journalHistory', JSON.stringify(updatedHistory));
    alert('Journal entry saved!'); // Optional: Provide user feedback
    setNewJournalEntry(''); // Clear the textarea for the next entry
  };

  return (
    <div className="mood-page-container">
      <header className="dashboard-header card">
        <div className="logo">EduKids</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learning">My Learning</Link>
          <Link to="/mood" className="active">My Mood</Link>
          {/* UPDATED: These are now functional links */}
          <Link to="/rewards">Rewards</Link>
          {/* <Link to="/help">Help</Link> */}
        </nav>
        <div className="user-profile">
          <button className="logout-btn" onClick={logout}>Logout</button>
          <img src="/Images/login.jpg" alt="User Avatar" className="avatar" />
        </div>
      </header>

      <main className="mood-content">
        <div className="mood-check-in card">
          <div className="mood-title-decoration">
            {/* <img src="https://i.imgur.com/gK6gB3q.png" alt="Friendly Guide Mascot" className="mood-mascot" /> */}
          </div>
          <h1>How are you feeling today?</h1>
          <div className="mood-selector">
            {moods.map(mood => (
              <div
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                className={`mood-option ${selectedMood === mood.name ? 'selected' : ''}`}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span>{mood.name}</span>
              </div>
            ))}
          </div>
          <div className="coping-strategy">
            <p><strong>A little tip:</strong> {copingStrategies[selectedMood]}</p>
          </div>
        </div>

        <div className="mood-details">
          <div className="journal-section card">
            <h3>What's on your mind?</h3>
            <p>Write about your day. Your thoughts are always safe here.</p>
            <textarea
              placeholder="Today I feel..."
              value={newJournalEntry}
              onChange={(e) => setNewJournalEntry(e.target.value)}
            ></textarea>
            <button className="btn btn-save-journal" onClick={handleSaveJournal}>Save Entry</button>
            
            <div className="journal-history">
              <h4>Past Entries</h4>
              {journalHistory.length > 0 ? (
                journalHistory.map((entry, index) => (
                  <div key={index} className="journal-entry-card">
                    <p className="journal-entry-date">{entry.date}</p>
                    <p className="journal-entry-text">{entry.text}</p>
                  </div>
                ))
              ) : (
                <p className="no-entries-text">You haven't written any entries yet.</p>
              )}
            </div>
          </div>
          <div className="calendar-section card">
            <h3>Your Mood Calendar</h3>
            <p>See how you've been feeling! Click a day to add a mood.</p>
            <div className="calendar-grid">
              {Array.from({ length: 30 }, (_, i) => (
                <div 
                  key={i} 
                  className="calendar-day"
                  onClick={() => handleDayClick(i)}
                >
                  {moodHistory[i + 1] ? (
                    <span className="calendar-mood-emoji">{moodHistory[i + 1]}</span>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mood selection modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h3>How were you feeling on Day {selectedDay}?</h3>
            <div className="modal-mood-selector">
              {moods.map(mood => (
                <div
                  key={mood.name}
                  className="modal-mood-option"
                  onClick={() => handleMoodSelectForDay(mood)}
                >
                  <span className="modal-mood-emoji">{mood.emoji}</span>
                  <span>{mood.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW: Concern modal for mental health check */}
      {isConcernModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card concern-modal">
            <div className="concern-icon">❤️</div>
            <h3>We've noticed you might be feeling down.</h3>
            <p>It's brave to face tough feelings, and you don't have to do it alone. Would you like to see some options for getting help?</p>
            <div className="concern-actions">
              <button 
                className="btn btn-concern-yes" 
                onClick={() => navigate('/help')}
              >
                Yes, I need help
              </button>
              <button 
                className="btn btn-concern-no" 
                onClick={() => setIsConcernModalOpen(false)}
              >
                No, I'm okay for now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMoodPage;
