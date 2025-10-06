const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: false },
    gender: { type: String, required: false },
    school: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['Student', 'Counselor'],
      default: 'Student',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
