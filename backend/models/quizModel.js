const mongoose = require('mongoose');


const followUpSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, default: null },
});


const conditionalQuestionSchema = new mongoose.Schema({
  triggerQuestion: { 
    type: String,
    required: true,
  },
  options: [{ type: String, required: true }], 
  followUp: [followUpSchema],
});

const quizSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
    },
  ],
  conditionalQuestions: [conditionalQuestionSchema],

}, { collection: 'quizzes' });

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;