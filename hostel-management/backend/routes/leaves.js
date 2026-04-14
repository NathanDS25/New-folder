const express = require('express');
const Leave = require('../models/Leave');
const mockStore = require('../mockStore');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const isMock = () => process.env.USE_MOCK === 'true';

router.post('/', protect, async (req, res) => {
  try {
    req.body.requestedBy = req.user.id;
    if (isMock()) {
      const leave = { ...req.body, _id: Date.now().toString(), status: 'Pending', createdAt: new Date() };
      mockStore.leaves.push(leave);
      return res.status(201).json({ success: true, data: leave });
    }
    const leave = await Leave.create(req.body);
    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let leaves;
    if (isMock()) {
      leaves = req.user.role === 'Student' 
        ? mockStore.leaves.filter(l => l.requestedBy === req.user.id)
        : mockStore.leaves;
      
      // Map mock populated requestedBy
      leaves = leaves.map(leave => {
        const user = mockStore.users.find(u => u._id === leave.requestedBy);
        return { ...leave, requestedBy: user ? { _id: user._id, name: user.name } : { _id: leave.requestedBy, name: 'Student' } };
      });
    } else {
      let query = req.user.role === 'Student' ? Leave.find({ requestedBy: req.user.id }) : Leave.find();
      leaves = await query.populate('requestedBy', 'name');
    }
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Warden'), async (req, res) => {
  try {
    if (isMock()) {
      const index = mockStore.leaves.findIndex(l => l._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Leave not found' });
      mockStore.leaves[index] = { ...mockStore.leaves[index], ...req.body };
      return res.json({ success: true, data: mockStore.leaves[index] });
    }
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
