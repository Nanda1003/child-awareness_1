const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    studentEmail: {
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
  },
  { timestamps: true }
);

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;