const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  visitingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timeIn: { type: Date, required: true },
  timeOut: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', VisitorSchema);
