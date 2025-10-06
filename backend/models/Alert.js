const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  studentSchool: {
    type: String,
    required: true,
  },
  quizTitle: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
 
  followUpAnswers: [{
    question: String,
    answer: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Alert', AlertSchema);
