const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Alert = require('../models/Alert');
const nodemailer = require('nodemailer');

let io;
const setSocketIo = (socketIo) => { io = socketIo; };

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create initial alert
router.post('/', async (req, res) => {
  try {
    const { studentName, studentEmail, studentSchool, quizTitle, message } = req.body;

    const newAlert = new Alert({
      studentName,
      studentEmail,
      studentSchool,
      quizTitle,
      message,
      followUpAnswers: [],
      read: false,
    });

    const alert = await newAlert.save();

    // Emit real-time alert
    if (io) io.emit('new-alert', alert);

    // Send email to counselor
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'counselor@example.com',
      subject: `Alert: ${studentName} needs attention`,
      text: `
Student: ${studentName}
Email: ${studentEmail}
School: ${studentSchool}
Quiz: ${quizTitle}
Message: ${message}
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('Email error:', err);
      else console.log('Email sent:', info.response);
    });

    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update follow-up
router.put('/:id', async (req, res) => {
  try {
    const { followUpAnswers } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { $push: { followUpAnswers: { $each: followUpAnswers } }, message: 'Follow-up details provided.' },
      { new: true }
    );

    if (io) io.emit('update-alert', alert);

    // Send follow-up email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'counselor@example.com',
      subject: `Follow-up: ${alert.studentName}`,
      text: `New follow-up details from ${alert.studentName}:\n${JSON.stringify(followUpAnswers, null, 2)}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('Email error:', err);
      else console.log('Follow-up email sent:', info.response);
    });

    res.status(200).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.status(200).json({ message: 'Alert deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = { router, setSocketIo };
