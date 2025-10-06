import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo">EduKids</div>
        {/* <button className="login-signup-btn" onClick={() => navigate('/login')}>
          Login / Sign Up
        </button> */}
      </header>
      
      <main className="landing-main">
        <div className="hero-content">
          <h1>Welcome to EduKids</h1>
          <p>
            Explore a fun and safe space to learn about your body and
            relationships. Our interactive lessons and quizzes make
            learning easy and enjoyable.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-start" onClick={() => navigate('/login')}>
              Start Learning
            </button>
            <button className="btn btn-quiz" onClick={() => navigate('/login')}>
              Take a Quiz
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
