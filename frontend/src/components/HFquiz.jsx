import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HFquiz.css';

const HFquiz = () => {
  const { currentUser, logout } = useAuth();
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [conditionalAnswers, setConditionalAnswers] = useState({});
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [activeAlertId, setActiveAlertId] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/${moduleId}`);
        if (!response.ok) throw new Error('Quiz not found for this module.');
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (moduleId) fetchQuizData();
  }, [moduleId]);

  // Send initial alert to backend
  const sendInitialAlert = async (quizTitle) => {
    if (!currentUser) return null;
    const initialAlert = {
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentSchool: currentUser.school,
      quizTitle,
      message: 'Answered YES to a sensitive question. Follow-up pending.',
    };
    try {
      const res = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialAlert),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveAlertId(data._id);
        window.alert(
          "An alert has been sent to the counselor. Please provide more details below if you feel safe."
        );
        return data._id;
      }
      return null;
    } catch (err) {
      console.error('Failed to send initial alert:', err);
      return null;
    }
  };

  // Send follow-up answers to backend
  const sendFollowUpDetails = async () => {
    if (!activeAlertId) {
      window.alert("Could not find the initial alert to update.");
      return;
    }

    const followUpDetails = Object.values(followUpAnswers);

    try {
      const res = await fetch(`http://localhost:5000/api/alerts/${activeAlertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUpAnswers: followUpDetails }),
      });

      if (res.ok) {
        window.alert("Thank you! Your additional details have been sent to the counselor.");
        setFollowUpAnswers({});
      } else {
        window.alert("Sorry, there was a problem sending your details.");
      }
    } catch (err) {
      console.error('Failed to send follow-up details:', err);
    }
  };

  const handleConditionalAnswer = async (index, answer) => {
    setConditionalAnswers(prev => ({ ...prev, [index]: answer }));

    // Trigger initial alert if YES
    if (answer.toLowerCase() === 'yes' && !activeAlertId) {
      await sendInitialAlert(quiz.title);
    }
  };

  const handleFollowUpChange = (cIndex, fIndex, value) => {
    const key = `${cIndex}-${fIndex}`;
    const question = quiz.conditionalQuestions[cIndex].followUp[fIndex].question;
    setFollowUpAnswers(prev => ({ ...prev, [key]: { question, answer: value } }));
  };

  const handleLogout = () => { logout(); };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    if (answers[questionIndex] || !quiz) return;
    const isCorrect = selectedOption === quiz.questions[questionIndex].correctAnswer;
    setAnswers(prev => ({ ...prev, [questionIndex]: { selected: selectedOption, isCorrect } }));
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleSubmitQuiz = () => {
    setIsQuizFinished(true);
    const progressData = JSON.parse(localStorage.getItem('learningProgress')) || {};
    const isQuizPassed = score === (quiz?.questions?.length || 0);
    progressData[moduleId] = { ...progressData[moduleId], quiz: isQuizPassed };
    localStorage.setItem('learningProgress', JSON.stringify(progressData));
    setTimeout(() => navigate('/learning', { replace: true, state: { _id: Date.now() } }), 100);
  };

  const handleRestartQuiz = () => {
    setAnswers({});
    setScore(0);
    setIsQuizFinished(false);
    setConditionalAnswers({});
    setFollowUpAnswers({});
    setActiveAlertId(null);
  };

  if (loading) return <div className="page-status">Loading Quiz... 🧠</div>;
  if (!quiz) return (
    <div className="page-status">
      <h2>Oops! Quiz not found.</h2>
      <p>We couldn't find a quiz for this lesson. Please try another one!</p>
      <Link to="/learning" className="btn btn-secondary">Back to Learning</Link>
    </div>
  );

  if (isQuizFinished) return (
    <div className="quiz-container">
      <div className="card quiz-results-card">
        <div className="results-icon">🎉</div>
        <h1>Quiz Complete!</h1>
        <p>You scored {score} out of {quiz.questions.length}!</p>
        <div className="results-actions">
          <button onClick={handleRestartQuiz} className="btn btn-primary">Try Again</button>
          <Link to="/learning" state={{ _id: Date.now() }} className="btn btn-secondary">Back to Learning</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="quiz-container">
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
      <div className="card quiz-card single-page-quiz">
        <div className="quiz-header"><h2>{quiz.title}</h2></div>

        {quiz.questions?.map((question, index) => (
          <div key={index} className="question-block">
            <div className="question-header">
              <p className="quiz-question">{index + 1}. {question.question}</p>
              {answers[index] && (
                <div className={`feedback-icon-inline ${answers[index].isCorrect ? 'correct' : 'incorrect'}`}>
                  {answers[index].isCorrect ? '🥳' : '😢'}
                </div>
              )}
            </div>
            <div className="quiz-options-grid">
              {question.options.map((option, optionIndex) => {
                const answerState = answers[index];
                const isSelected = answerState?.selected === option;
                const isCorrect = option === question.correctAnswer;
                let optionClass = 'quiz-option-card';
                if (answerState) {
                  if (isSelected) optionClass += isCorrect ? ' correct' : ' incorrect';
                  else if (isCorrect) optionClass += ' correct-unselected';
                }
                return (
                  <div key={optionIndex} className={optionClass} onClick={() => handleAnswerSelect(index, option)}>
                    {option}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {quiz.conditionalQuestions && quiz.conditionalQuestions.length > 0 && Object.keys(answers).length === quiz.questions.length && (
          <div className="question-block conditional-section">
            {quiz.conditionalQuestions.map((cq, i) => {
              const shouldShowFollowUp = conditionalAnswers[i]?.toLowerCase() === 'yes';
              return (
                <div key={i}>
                  <p className="quiz-question">{quiz.questions.length + i + 1}. {cq.triggerQuestion}</p>
                  <div className="conditional-options">
                    {cq.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleConditionalAnswer(i, option)}
                        className={`btn-conditional ${conditionalAnswers[i] === option ? 'active' : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {shouldShowFollowUp && (
                    <div className="follow-up-questions">
                      <p className="follow-up-intro">Thank you for sharing. If you feel safe, you can write more below.</p>
                      {cq.followUp.map((followUp, j) => (
                        <div key={j} className="form-group-follow-up">
                          <label>{followUp.question}</label>
                          <textarea
                            placeholder="You can write here..."
                            onChange={(e) => handleFollowUpChange(i, j, e.target.value)}
                          ></textarea>
                        </div>
                      ))}
                      <button onClick={sendFollowUpDetails} className="btn btn-primary btn-send-alert">
                        Send Details to Counselor
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="quiz-footer">
          <button
            onClick={handleSubmitQuiz}
            className="btn btn-primary"
            disabled={!quiz || Object.keys(answers).length < quiz.questions.length}
          >
            Show My Score!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HFquiz;
