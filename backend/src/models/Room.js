const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: Number, required: true, unique: true },
  floor: { type: Number, required: true },
  // 0-indexed horizontal position from the staircase/lift (first room = 0).
  position: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
});

module.exports = mongoose.model('Room', roomSchema);
