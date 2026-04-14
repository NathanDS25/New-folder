const express = require('express');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const mockStore = require('../mockStore');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const isMock = () => process.env.USE_MOCK === 'true';

router.get('/', protect, authorize('Admin'), async (req, res) => {
  try {
    let rooms;
    let openComplaintsCount;
    let studentCount;

    if (isMock()) {
      rooms = mockStore.rooms;
      openComplaintsCount = mockStore.complaints.filter(c => c.status !== 'Resolved').length;
      studentCount = mockStore.users.filter(u => u.role === 'Student').length;
    } else {
      rooms = await Room.find();
      openComplaintsCount = await Complaint.countDocuments({ status: { $ne: 'Resolved' } });
      studentCount = await User.countDocuments({ role: 'Student' });
    }

    let totalRevenue = 0;
    let availableBeds = 0;
    let totalBeds = 0;

    rooms.forEach(room => {
      totalBeds += room.capacity;
      const occupantsCount = room.occupants.length;
      availableBeds += (room.capacity - occupantsCount);
      totalRevenue += (occupantsCount * room.fees); // simplistic revenue calc
    });

    res.json({
      success: true,
      data: {
        totalRevenue,
        availableBeds,
        totalBeds,
        openComplaints: openComplaintsCount,
        studentCount
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
