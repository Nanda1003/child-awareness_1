import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import "./CounselorDashboard.css";

const socket = io("http://localhost:5000");

const CounselorDashboard = () => {
  const { logout } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [expandedAlertId, setExpandedAlertId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();

    // Listen to real-time events
    socket.on("new-alert", (alert) => {
      setAlerts(prev => [alert, ...prev]);
      console.log("New alert received:", alert);
    });

    socket.on("update-alert", (alert) => {
      setAlerts(prev => prev.map(a => a._id === alert._id ? alert : a));
      console.log("Alert updated:", alert);
    });

    return () => {
      socket.off("new-alert");
      socket.off("update-alert");
    };
  }, []);

  const handleDelete = async (alertId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this alert?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/alerts/${alertId}`, { method: "DELETE" });
      if (res.ok) setAlerts(prev => prev.filter(a => a._id !== alertId));
    } catch (err) {
      console.error(err);
    }
  };

  const stats = useMemo(() => ({
    totalAlerts: alerts.length,
    uniqueStudents: new Set(alerts.map(a => a.studentEmail)).size
  }), [alerts]);

  return (
    <div className="counselor-dashboard-container">
      <header className="dashboard-header card">
        <div className="logo">EduKids Counselor Portal</div>
        <div className="user-profile">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-banner card">
          <h1>Welcome, Counselor!</h1>
          <p>Recent student activity.</p>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">🚨</div>
            <div>
              <h3>{stats.totalAlerts}</h3>
              <p>Total Alerts</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">👥</div>
            <div>
              <h3>{stats.uniqueStudents}</h3>
              <p>Unique Students</p>
            </div>
          </div>
        </div>

        <div className="alerts-section">
          <h2>Recent Student Alerts</h2>
          {loading ? <p>Loading alerts...</p> : (
            alerts.length === 0 ? <p>No new alerts. ✅</p> : (
              <div className="alerts-grid">
                {alerts.map(alert => (
                  <div key={alert._id} className="alert-card card" onClick={() => setExpandedAlertId(prev => prev === alert._id ? null : alert._id)}>
                    <div className="alert-header">
                      <h3>⚠️ Alert</h3>
                      <span>{new Date(alert.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="alert-body">
                      <p><strong>Student:</strong> {alert.studentName}</p>
                      <p><strong>Email:</strong> {alert.studentEmail}</p>
                      <p><strong>Module:</strong> {alert.quizTitle}</p>
                      <p><strong>Message:</strong> {alert.message}</p>

                      {expandedAlertId === alert._id && alert.followUpAnswers?.length > 0 && (
                        <div className="follow-up-details">
                          <h4>Follow-up:</h4>
                          {alert.followUpAnswers.map((qa, i) => (
                            qa.answer && (
                              <div key={i}>
                                <p><strong>Q:</strong> {qa.question}</p>
                                <p><strong>A:</strong> {qa.answer}</p>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="alert-footer">
                      <button onClick={(e) => handleDelete(alert._id, e)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default CounselorDashboard;
