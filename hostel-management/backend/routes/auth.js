const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mockStore = require('../mockStore');
const { protect } = require('../middleware/auth');
const router = express.Router();

const isMock = () => process.env.USE_MOCK === 'true';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    let user;
    if (isMock()) {
       user = await mockStore.findUserByEmail(email);
    } else {
       const User = require('../models/User');
       user = await User.findOne({ email });
    }

    if (user) return res.status(400).json({ success: false, message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isMock()) {
      user = await mockStore.addUser({ name, email, password: hashedPassword, role });
    } else {
      const User = require('../models/User');
      user = await User.create({ name, email, password: hashedPassword, role });
    }
    
    res.status(201).json({ success: true, token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    if (isMock()) {
      user = await mockStore.findUserByEmail(email);
    } else {
      const User = require('../models/User');
      user = await User.findOne({ email });
    }

    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    res.status(200).json({ success: true, token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;
