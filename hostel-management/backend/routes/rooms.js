const express = require('express');
const Room = require('../models/Room');
const mockStore = require('../mockStore');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const isMock = () => process.env.USE_MOCK === 'true';

router.get('/', protect, async (req, res) => {
  try {
    let rooms;
    if (isMock()) {
      rooms = mockStore.rooms;
    } else {
      rooms = await Room.find().populate('occupants', 'name email');
    }
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('Admin', 'Warden'), async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
