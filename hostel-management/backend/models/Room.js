const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true }, // e.g. 1 for single, 2 for double, 4 for dorm
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  type: { type: String, enum: ['single', 'double', 'dorm'], required: true },
  fees: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
