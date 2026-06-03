const express = require('express');
const Room = require('../models/Room');
const { seed } = require('../seed');
const { selectRooms } = require('../services/booking');
const { maxRoomsPerBooking } = require('../config');

const router = express.Router();

// All rooms, ordered by floor then position.
router.get('/rooms', async (req, res) => {
  const rooms = await Room.find().sort({ floor: 1, position: 1 });
  res.json(rooms);
});

// Book `count` rooms following the proximity rules.
router.post('/book', async (req, res) => {
  const count = Number(req.body.count);
  if (!Number.isInteger(count) || count < 1 || count > maxRoomsPerBooking) {
    return res
      .status(400)
      .json({ error: `Please request between 1 and ${maxRoomsPerBooking} rooms.` });
  }

  const available = await Room.find({ isBooked: false });
  const result = selectRooms(available, count);
  if (result.error) return res.status(409).json({ error: result.error });

  const ids = result.rooms.map((r) => r._id);
  await Room.updateMany({ _id: { $in: ids } }, { isBooked: true });

  res.json({
    bookedRooms: result.rooms
      .map((r) => r.roomNumber)
      .sort((a, b) => a - b),
    travelTime: result.travelTime,
  });
});

// Randomly occupy rooms (resets first, then books a random subset).
router.post('/random', async (req, res) => {
  const all = await Room.find();
  await Room.updateMany({}, { isBooked: false });

  const toBook = all.filter(() => Math.random() < 0.4).map((r) => r._id);
  if (toBook.length) {
    await Room.updateMany({ _id: { $in: toBook } }, { isBooked: true });
  }

  const rooms = await Room.find().sort({ floor: 1, position: 1 });
  res.json(rooms);
});

// Clear all bookings.
router.post('/reset', async (req, res) => {
  await Room.updateMany({}, { isBooked: false });
  const rooms = await Room.find().sort({ floor: 1, position: 1 });
  res.json(rooms);
});

module.exports = { router, ensureSeeded };

// Seeds the collection on first boot if it is empty.
async function ensureSeeded() {
  const count = await Room.estimatedDocumentCount();
  if (count === 0) await seed();
}
