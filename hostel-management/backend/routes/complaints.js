const express = require('express');
const Complaint = require('../models/Complaint');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  req.body.reportedBy = req.user.id;
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let query = req.user.role === 'Student' ? Complaint.find({ reportedBy: req.user.id }) : Complaint.find();
    const complaints = await query.populate('reportedBy', 'name');
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Warden'), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
