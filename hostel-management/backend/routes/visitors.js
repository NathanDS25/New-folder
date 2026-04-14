const express = require('express');
const Visitor = require('../models/Visitor');
const mockStore = require('../mockStore');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const isMock = () => process.env.USE_MOCK === 'true';

router.post('/', protect, authorize('Admin', 'Warden'), async (req, res) => {
  try {
    if (isMock()) {
       const visitor = { ...req.body, _id: Date.now().toString(), createdAt: new Date() };
       mockStore.visitors.push(visitor);
       return res.status(201).json({ success: true, data: visitor });
    }
    const visitor = await Visitor.create(req.body);
    res.status(201).json({ success: true, data: visitor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let visitors;
    if (isMock()) {
      visitors = req.user.role === 'Student' 
        ? mockStore.visitors.filter(v => v.visitingUser === req.user.id)
        : mockStore.visitors;

      // Populate mock student data
      visitors = visitors.map(v => {
        const student = mockStore.users.find(u => u._id === v.visitingUser);
        return { ...v, visitingUser: student ? { _id: student._id, name: student.name } : { _id: v.visitingUser, name: 'Student' } };
      });
    } else {
      let query = req.user.role === 'Student' ? Visitor.find({ visitingUser: req.user.id }) : Visitor.find();
      visitors = await query.populate('visitingUser', 'name');
    }
    res.json({ success: true, count: visitors.length, data: visitors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Warden'), async (req, res) => {
  try {
    if (isMock()) {
       const index = mockStore.visitors.findIndex(v => v._id === req.params.id);
       if (index === -1) return res.status(404).json({ success: false, message: 'Visitor not found' });
       mockStore.visitors[index] = { ...mockStore.visitors[index], timeOut: new Date() };
       return res.json({ success: true, data: mockStore.visitors[index] });
    }
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, { timeOut: new Date() }, { new: true });
    res.json({ success: true, data: visitor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
