import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './LessonPage.css';

const LessonPage = () => {
  const { moduleId } = useParams(); 
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [checkedItems, setCheckedItems] = useState({});
  const [progress, setProgress] = useState(0);

  // State to track which quiz item is clicked
  const [activeQuizItem, setActiveQuizItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/modules/${moduleId}`);
        if (!response.ok) throw new Error('Module not found');
        const data = await response.json();
        setModule(data);
      } catch (error) {
        console.error('Error fetching module:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [moduleId]);

  // Load checked items from localStorage when module loads
  useEffect(() => {
    if (!module) return;
    const progressData = JSON.parse(localStorage.getItem('learningProgress')) || {};
    const moduleProgress = progressData[moduleId];
    if (moduleProgress?.checkedItems) {
      setCheckedItems(moduleProgress.checkedItems);
      // Recalculate progress based on loaded checked items
      const checklistSection = module.content.find(s => s.type === 'checklist');
      if (checklistSection) {
        const totalItems = checklistSection.items.length;
        const checkedCount = Object.values(moduleProgress.checkedItems).filter(Boolean).length;
        setProgress((checkedCount / totalItems) * 100);
      }
    }
  }, [module, moduleId]);

  const handleCheckItem = (index) => {
    const newCheckedItems = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(newCheckedItems);

    const checklistSection = module.content.find(s => s.type === 'checklist');
    if (checklistSection) {
      const totalItems = checklistSection.items.length;
      const checkedCount = Object.values(newCheckedItems).filter(Boolean).length;
      const newProgress = (checkedCount / totalItems) * 100;
      setProgress(newProgress);

      // Save progress to localStorage
      const progressData = JSON.parse(localStorage.getItem('learningProgress')) || {};
      progressData[moduleId] = {
        ...progressData[moduleId],
        checklist: newProgress,
        checkedItems: newCheckedItems, // Save the actual checked state
      };
      localStorage.setItem('learningProgress', JSON.stringify(progressData));
    }
  };

  if (loading) return <div className="page-status">Loading your lesson... ✨</div>;
  if (!module) return <div className="page-status">Oops! We couldn't find that lesson. <Link to="/learning">Go back</Link></div>;

  return (
    <div className="lesson-container">
      <header className="dashboard-header card">
        <div className="logo">EduKids</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learning" className="active">My Learning</Link>
          <Link to="/mood">My Mood</Link>
          <Link to="/rewards">Rewards</Link>
          <Link to="/help">Help</Link>
        </nav>
        <div className="user-profile">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <img src="/Images/allaboutme.jpg" alt="User Avatar" className="avatar" />
        </div>
      </header>
      
      <div className="lesson-progress-tracker card">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">Lesson Progress: {Math.round(progress)}%</span>
      </div>

      <main className="lesson-content">
        {module.content.map((section, index) => {
          switch (section.type) {
            case 'intro':
              return (
                <div key={index} className="lesson-intro card">
                  <div className="intro-text"><h1>{section.subText}</h1><p>{section.mainText}</p></div>
                  <img src={section.imageUrl} alt="Intro" className="intro-image" />
                </div>
              );
            case 'heading':
              return <div key={index} className="section-divider"><h2>{section.mainText}</h2></div>;
            case 'trait-grid':
              return (
                <div key={index} className="healthy-traits-grid">
                  {section.items.map((trait, i) => (
                    <div key={i} className="trait-card card">
                      <div className="trait-icon">{trait.icon}</div>
                      <h3>{trait.title}</h3><p>{trait.text}</p>
                    </div>
                  ))}
                </div>
              );
            case 'red-flags':
               return (
                <div key={index} className="red-flags-section">
                    <img src={section.imageUrl} alt="Friends talking" className="red-flags-image"/>
                    <div className="red-flags-content card">
                        <h3>Uh-oh! Red Flags!</h3>
                        <ul>{section.items.map((flag, i) => <li key={i}>{flag.text}</li>)}</ul>
                    </div>
                </div>
              );
            case 'story-time':
                return (
                    <div key={index} className="story-time-section card">
                        <img src={section.imageUrl} alt="Story illustration" />
                        <div>
                            <h2>{section.mainText}</h2>
                            <p>{section.subText}</p>
                        </div>
                    </div>
                );
            case 'activity':
                return (
                    <div key={index} className="activity-section card">
                        <div>
                            <h2>{section.mainText}</h2>
                            <p>{section.subText}</p>
                        </div>
                        <img src={section.imageUrl} alt="Activity illustration" />
                    </div>
                );
             case 'fun-facts':
                return (
                    <div key={index} className="fun-facts-section card">
                        <h2>{section.mainText}</h2>
                        <ul>
                            {section.items.map((fact, i) => (
                                <li key={i}><span>{fact.icon}</span>{fact.text}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'checklist':
              return (
                 <div key={index} className="checklist-section card">
                    <h2>{section.mainText}</h2><p>{section.subText}</p>
                    <div className="checklist-items">
                      {section.items.map((item, i) => (
                        <div key={i} className="checklist-item" onClick={() => handleCheckItem(i)}>
                          <div className={`checkbox ${checkedItems[i] ? 'checked' : ''}`}>{checkedItems[i] && '✔'}</div>
                          <label className={`${checkedItems[i] ? 'checked' : ''}`}>{item.text}</label>
                        </div>
                      ))}
                    </div>
                 </div>
              );
            case 'pop-quiz':
              return (
                <div key={index} className="pop-quiz-section card">
                  <h2>{section.mainText}</h2>
                  <p>{section.subText}</p>
                  <div className="quiz-options">
                    {section.items.map((quiz, i) => (
                      <div key={i} className={`quiz-option-container ${activeQuizItem === i ? 'active' : ''}`}>
                        <button
                          className={`quiz-option ${activeQuizItem === i ? 'active' : ''}`}
                          onClick={() => setActiveQuizItem(activeQuizItem === i ? null : i)}
                        >
                          {quiz.text}
                        </button>

                        {/* ✅ FIXED: Only render textarea when active */}
                        {activeQuizItem === i && (
                          <textarea
                            className="quiz-option-textarea active"
                            placeholder="Write your thoughts here..."
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'affirmations':
                return (
                    <div key={index} className="affirmations-section card">
                        <h2>{section.mainText}</h2>
                        <div className="affirmations-grid">
                            {section.items.map((affirmation, i) => <div key={i} className="affirmation-item">{affirmation.text}</div>)}
                        </div>
                    </div>
                );
            case 'closing':
                return (
                    <div key={index} className="closing-section">
                        <img src={section.imageUrl} alt="Closing illustration"/>
                        <h2>{section.mainText}</h2>
                        <p>{section.subText}</p>
                    </div>
                );
            default:
              return null;
          }
        })}
        
        <div className="back-to-dashboard">
          <Link to="/learning" className="btn btn-back">Back to My Learning</Link>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
