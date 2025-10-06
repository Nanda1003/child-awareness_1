import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    school: '',
    email: '',
    password: '',
  });
  const [selectedRole, setSelectedRole] = useState('Student');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save user info
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userName', formData.name);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userSchool', formData.school);

        setMessage('Account created successfully! Redirecting...');

        setTimeout(() => {
          if (selectedRole === 'Student') {
            navigate('/dashboard'); // Home page for student
          } else if (selectedRole === 'Counselor') {
            navigate('/counselor-dashboard');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        setMessage(data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <div className="logo">EduKids</div>
        <button className="btn btn-login-nav" onClick={() => navigate('/login')}>
          Login
        </button>
      </header>

      <main className="signup-content">
        <div className="card signup-card">
          <div className="signup-card-header">
            <h1>Create your account</h1>
            <p>Join our community and start learning!</p>
          </div>

          <form className="signup-form" onSubmit={handleSignUp}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter your full name"
                  required 
                />
              </div>

              {selectedRole === 'Student' && (
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    required
                  />
                </div>
              )}
            </div>

            {selectedRole === 'Student' && (
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="school">School</label>
              <input 
                type="text" 
                id="school" 
                value={formData.school} 
                onChange={handleInputChange} 
                placeholder="Enter your school name"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Enter your email address"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="Create a password"
                required 
              />
            </div>

            <div className="form-group">
              <label>I am a...</label>
              <div className="role-selector">
                {['Student', 'Counselor'].map(role => (
                  <button
                    type="button"
                    key={role}
                    className={`role-btn ${selectedRole === role ? 'active' : ''}`}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {message && <p className="message">{message}</p>}

            <button type="submit" className="btn btn-signup">Sign Up</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
