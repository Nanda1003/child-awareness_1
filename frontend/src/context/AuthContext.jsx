import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
      if (loggedInStudent) {
        setCurrentUser(loggedInStudent);
      }
    } catch (error) {
      console.error("Failed to parse loggedInStudent from localStorage", error);
      localStorage.removeItem('loggedInStudent');
    }
  }, []);

  const login = (studentData) => {
    // We only need to store one item now, the full user object
    localStorage.setItem('loggedInStudent', JSON.stringify(studentData));
    setCurrentUser(studentData);
  };

  const logout = () => {
    localStorage.removeItem('loggedInStudent');
    // Also clear other legacy items just in case
    const sessionKeys = ['isLoggedIn', 'userName', 'userEmail', 'userSchool', 'userRole'];
    sessionKeys.forEach(key => localStorage.removeItem(key));
    setCurrentUser(null);
    navigate('/login');
  };

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};