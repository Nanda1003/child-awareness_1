const express = require('express');
const router = express.Router();
const Alert = require('../models/alertModel');

// Route to send alert - only saves alert to database, no Twilio messaging
router.post('/send-alert', async (req, res) => {
  try {
    const { message, studentEmail, quizTitle } = req.body;

    // Save the alert to the database
    const newAlert = new Alert({
      studentEmail,
      quizTitle,
      message,
    });
    await newAlert.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error saving alert:', err);
    res.status(500).json({ success: false, error: 'Failed to save alert' });
  }
});

// Route for counselors to fetch all alerts
router.get('/alerts', async (req, res) => {
  try {
    // Fetch alerts, newest first
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
