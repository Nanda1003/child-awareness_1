const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// ===================== REGISTER =====================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, gender, school, role } = req.body;

    // Required fields check
    if (!name || !email || !password || !role || !school) {
      return res.status(400).json({ msg: 'Please fill all required fields' });
    }

    // Restrict only one counselor
    if (role === 'Counselor') {
      const existingCounselor = await User.findOne({ role: 'Counselor' });
      if (existingCounselor) {
        return res
          .status(400)
          .json({ msg: 'Counselor already exists. Only one counselor is allowed.' });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create user
    const user = new User({ name, email, password, age, gender, school, role });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({
      msg: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error('Error in /register:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    res.status(200).json({
      msg: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error('Error in /login:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
